<?php

if (!function_exists('preg_replace_callback_array')) {
    function preg_replace_callback_array(array $patterns_and_callbacks, $subject, $limit = -1, &$count = NULL)
    {
        $count = 0;
        foreach ($patterns_and_callbacks as $pattern => &$callback) {
            $subject = preg_replace_callback($pattern, $callback, $subject, $limit, $partial_count);
            $count += $partial_count;
        }
        return preg_last_error() == PREG_NO_ERROR ? $subject : NULL;
    }
}