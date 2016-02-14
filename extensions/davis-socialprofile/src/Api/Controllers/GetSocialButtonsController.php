<?php namespace Davis\SocialProfile\Api\Controllers;

use Davis\SocialProfile\Repository\UserSocialRepository;
use Flarum\Api\Controller\AbstractResourceController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class GetSocialButtonsController extends AbstractResourceController
{
    public $serializer = 'Davis\SocialProfile\Api\Serializers\GetSocialButtonsSerializer';
    
    public function __construct(UserSocialRepository $users)
    {
        $this->users = $users;
    }
    
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $id = array_get($request->getQueryParams(), 'user');

        $actor = $request->getAttribute('actor');

        return $this->users->findOrFail($id, $actor);
    }
}
