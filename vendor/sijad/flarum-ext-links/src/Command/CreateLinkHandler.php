<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links\Command;

use Flarum\Core\Access\AssertPermissionTrait;
use Sijad\Links\Link;
use Sijad\Links\LinkValidator;

class CreateLinkHandler
{
    use AssertPermissionTrait;

    /**
     * @var LinkValidator
     */
    protected $validator;

    /**
     * @param LinkValidator $validator
     */
    public function __construct(LinkValidator $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param CreateLink $command
     * @return Link
     */
    public function handle(CreateLink $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $this->assertAdmin($actor);

        $link = Link::build(
            array_get($data, 'attributes.title'),
            array_get($data, 'attributes.url'),
            array_get($data, 'attributes.isInternal'),
            array_get($data, 'attributes.isNewtab')
        );

        $this->validator->assertValid($link->getAttributes());

        $link->save();

        return $link;
    }
}
