<?php

namespace Flagrow\Analytics\Piwik;

class PaqPushList
{
    protected $pushs = [];

    /**
     * Wraps a value that should be injected in the javascript without escaping
     * @param $value
     * @return RawExpression
     */
    public function raw($value)
    {
        return new RawExpression($value);
    }

    /**
     * Add a _paq.push() call to the list. Pass each item of the javascript array as a new parameter
     */
    public function addPush()
    {
        $this->pushs[] = func_get_args();
    }

    /**
     * Creates the javascript output for the _paq.push() calls
     * @return string
     */
    public function asJavascript()
    {
        return implode("\n    ", array_map(function ($push) {
            return '_paq.push([' . implode(', ', array_map(function ($item) {
                    if ($item instanceof RawExpression) {
                        return $item->value;
                    }

                    // JSON encoding is used to escape data injected into javascript
                    return json_encode($item);
                }, $push)) . ']);';
        }, $this->pushs));
    }
}
