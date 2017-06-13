<?php namespace Davis\InviteOnly\Api\Controllers;

use Davis\InviteOnly\Repository\ReferalRepository;
use Flarum\Api\Controller\AbstractResourceController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class GetUserCodesController extends AbstractResourceController
{
    public $serializer = 'Davis\InviteOnly\Api\Serializers\GetUserCodesSerializer';
    
    public function __construct(ReferalRepository $referal)
    {
        $this->referal = $referal;
    }
    
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $id = array_get($request->getQueryParams(), 'id');

        $actor = $request->getAttribute('actor');
        
        if($actor['attributes']['id'] == $id) {
            return $this->referal->findUsersToken($id);
        } else {
            $this->assertAdmin($actor);
            return $this->referal->findUsersToken($id);
        }
    }
}
