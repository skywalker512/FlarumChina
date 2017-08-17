<?php

exec('git diff --cached --name-status --diff-filter=ACM', $output);
foreach ($output as $file) {
    $fileName = '../'.trim(substr($file, 1));
    /**
     * PHP file.
     */
    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    if ($ext === 'php') {
        /**
         * Check for error.
         */
        $lint_output = array();
        exec('php -l '.$fileName, $lint_output, $return);
        if ($return === 0) {
            /*
             * PHP-CS-Fixer && add it back
             */
            echo 'Checking PSR-2 & Symfony conformity of '.trim(substr($file, 1))."\n";
            exec("php-cs-fixer fix {$fileName} --rules=@PSR2,@Symfony --using-cache=no");
            exec("git add {$fileName}");
        } else {
            echo "\nYour commit has php syntax error(s).\nYou MUST fix them before you commit.\n";
            echo "See the error massage(s) below.\n\n---------------------";
            echo implode("\n", $lint_output), "\n---------------------\n";
            exit(1);
        }
        /*
         * JS file
         */
    } elseif ($ext === 'js') {
        /*
         * JS Standard && add it back
         */
        echo 'Formatting '.trim(substr($file, 1))."\n";
        exec("standard --fix {$fileName}");
        exec("git add {$fileName}");
    }
    echo "\n";
}
exit(0);
