#!/usr/bin/env node
declare const fs: any;
declare const childProcess: any;
declare const path: any;
declare const CONSOLE_FORMAT: {
    BLUE: string;
    GREEN: string;
    RED: string;
    BOLD: string;
};
declare function getDependencies(path: string): Promise<string[] | any>;
declare function checkUnusedDependency(dependencies: string[], pathArg?: string): Promise<string[] | undefined>;
declare function run(): Promise<void>;
