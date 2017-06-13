<?php

namespace Flagrow\Bazaar\Repositories;

use Flagrow\Bazaar\Events\ExtensionWasInstalled;
use Flagrow\Bazaar\Events\ExtensionWasUpdated;
use Flagrow\Bazaar\Extensions\Extension;
use Flagrow\Bazaar\Extensions\ExtensionUtils;
use Flagrow\Bazaar\Extensions\PackageManager;
use Flagrow\Bazaar\Jobs\CacheClearJob;
use Flagrow\Bazaar\Search\FlagrowApi as Api;
use Flagrow\Bazaar\Traits\Cachable;
use Flarum\Core\Search\SearchResults;
use Flarum\Event\ExtensionWasUninstalled;
use Flarum\Extension\ExtensionManager;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;


class ExtensionRepository
{
    use Cachable;
    /**
     * @var Extension
     */
    protected $extension;
    /**
     * @var ExtensionManager
     */
    protected $manager;
    /**
     * @var FlagrowApi
     */
    private $client;
    /**
     * @var PackageManager
     */
    protected $packages;
    /**
     * @var Dispatcher
     */
    protected $events;
    /**
     * @var CacheClearJob
     */
    private $flush;

    /**
     * ExtensionRepository constructor.
     * @param ExtensionManager $manager
     * @param PackageManager $packages
     * @param Api $client
     * @param Dispatcher $events
     * @param CacheClearJob $flush
     */
    function __construct(
        ExtensionManager $manager,
        PackageManager $packages,
        Api $client,
        Dispatcher $events,
        CacheClearJob $flush
    ) {
        $this->manager = $manager;
        $this->client = $client;
        $this->packages = $packages;
        $this->events = $events;
        $this->flush = $flush;
    }

    /**
     * @return SearchResults
     */
    public function index()
    {
        $query = [
            'page[size]' => 9999,
            'page[number]' => 1, // Offset is zero-based, page number is 1-based
            'sort' => 'title' // Sort by package name per default
        ];

        $hash = 'flagrow.io.search.list';

        $response = $this->getOrSetCache($hash, function () use ($query) {
            $response = $this->client->get('packages', compact('query'));

            return (string)$response->getBody();
        });

        $json = json_decode($response, true);

        $areMoreResults = Arr::get($json, 'meta.pages_total', 0) > Arr::get($json, 'meta.pages_current', 0);

        $extensions = Collection::make(
            Arr::get($json, 'data', [])
        )->map(function ($package) {
            return $this->createExtension($package);
        })->keyBy('id');

        return new SearchResults($extensions, $areMoreResults);
    }

    /**
     * @param $id
     * @return null|Extension
     */
    public function getExtension($id)
    {
        if (strstr($id, '/')) {
            $id = ExtensionUtils::packageToId($id);
        }

        $response = $this->client->get("packages/$id");

        if ($response->getStatusCode() == 200) {
            $json = json_decode($response->getBody()->getContents(), true);
            return $this->createExtension(Arr::get($json, 'data', []));
        }

        return null;
    }

    /**
     * Create an Extension object and map all data sources.
     *
     * @param array $apiPackage
     * @return Extension
     */
    public function createExtension(array $apiPackage)
    {
        $extension = Extension::createFromAttributes($apiPackage['attributes']);

        $this->refreshInstalledExtension($extension);

        $this->flushCacheKey('flagrow.io.search.list');

        return $extension;
    }

    /**
     * @param Extension $extension
     */
    protected function refreshInstalledExtension(Extension &$extension)
    {
        $installedExtension = $this->manager->getExtension($extension->getShortName());

        if (!is_null($installedExtension)) {
            $extension->setInstalledExtension($installedExtension);
        }
    }

    /**
     * Install an extension.
     *
     * @param string $package
     * @return Extension|null
     */
    public function installExtension($package)
    {
        $this->packages->requirePackage($package);

        $extension = $this->getExtension($package);

        $this->flush->fire();

        $this->events->fire(
            new ExtensionWasInstalled($extension->getInstalledExtension())
        );

        return $extension;
    }

    /**
     * @param $package
     * @param null|string $version
     * @return Extension|null
     */
    public function updateExtension($package, $version = null)
    {
        $extension = $this->getExtension($package);

        $this->packages->updatePackage($extension->getPackage());

        $this->manager->migrate($extension->getInstalledExtension());

        $this->flush->fire();

        $this->events->fire(
            new ExtensionWasUpdated($extension->getInstalledExtension())
        );

        $this->refreshInstalledExtension($extension);

        return $extension;
    }

    /**
     * @param $package
     * @return Extension|null
     */
    public function removeExtension($package)
    {
        $extension = $this->getExtension($package);

        if ($extension->isEnabled()) {
            $this->manager->disable($extension->id);
        }

        $this->manager->migrateDown($extension->getInstalledExtension());

        $this->packages->removePackage($extension->getPackage());

        $installedExtension = $extension->getInstalledExtension();

        $extension->setInstalledExtension(null);

        $this->flush->fire();

        $this->events->fire(
            new ExtensionWasUninstalled($installedExtension)
        );

        return $extension;
    }

    /**
     * @param $package
     * @param bool $favorite
     * @return Extension|null|\Psr\Http\Message\ResponseInterface
     */
    public function favorite($package, $favorite = true)
    {
        $response = $this->client->post('packages/favorite', [
            'form_params' => [
                'package_id' => $package,
                'favorite' => $favorite
            ]
        ]);

        if (in_array($response->getStatusCode(), [200, 201])) {
            $json = json_decode($response->getBody()->getContents(), true);
            return $this->createExtension(Arr::get($json, 'data', []));
        }

        if ($response->getStatusCode() === 409) {
            return $response;
        }

        return null;
    }
}
