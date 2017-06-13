<?php

namespace Flagrow\Masquerade\Http\Controllers;

use Flarum\Forum\Controller\WebAppController;
use Flarum\Core\Access\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface as Request;

class ViewProfileController extends WebAppController
{
    use AssertPermissionTrait;
    /**
     * {@inheritdoc}
     */
    public function render(Request $request)
    {
        $this->assertCan($request->getAttribute('actor'), 'flagrow.masquerade.view-profile');

        return parent::render($request);
    }
}
