<?php namespace Davis\InviteOnly\Api\Controllers;

use Davis\InviteOnly\Api\Serializers\CreateNewCodeSerializer;
use Davis\InviteOnly\Commands\CreateNewCode;
use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Zend\Diactoros\UploadedFile;

class CreateNewCodeController extends AbstractResourceController
{

    public $serializer = CreateNewCodeSerializer::class;

    protected $bus;

    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }
 
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $refid = array_get($request->getParsedBody(), 'refid');

        return $this->bus->dispatch(
            new CreateNewCode($refid, $actor)
        );
    }
}
