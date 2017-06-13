<?php namespace Davis\SecureHttps\Api\Controllers;

use Flarum\Api\Controller\AbstractResourceController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Flarum\Core\Access\AssertPermissionTrait;

class GetImageUrlController extends AbstractResourceController
{
    use AssertPermissionTrait;
    
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $imgurl = array_get($request->getQueryParams(), 'imgurl');
        //Apache Support
        $imgurl = str_replace('%252F', '%2F', $imgurl);
        $this->assertCan($request->getAttribute('actor'), 'viewDiscussions');
        header("Content-type: image/".substr($imgurl, -3));
        echo file_get_contents('http://'.urldecode($imgurl));
        //Prevent Serialization
        die();
    }
}
