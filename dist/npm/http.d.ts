declare function createHTTPServer(options: any, httpPort: any): {
    server: any;
    start: () => Promise<unknown>;
    stop: () => Promise<void>;
};
export { createHTTPServer };
