<?php

namespace Flagrow\Masquerade\Http\Controllers;

use Flarum\Forum\Controller\WebAppController;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\PermissionDeniedException;
use Psr\Http\Message\ServerRequestInterface as Request;

class ManageProfileController extends WebAppController
{
    use AssertPermissionTrait;
    /**
     * {@inheritdoc}
     */
    public function render(Request $request)
    {
        if (! $request->getAttribute('session')->get('user_id')) {
            throw new PermissionDeniedException;
        }

        $this->assertCan($request->getAttribute('actor'), 'flagrow.masquerade.have-profile');

        return parent::render($request);
    }
}
