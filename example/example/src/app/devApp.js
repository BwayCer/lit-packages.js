
export async function doServer(server) {
  const ipAaddress
    = await import('ip').then(result => result.default.address());
  const {hostname, port} = server.config;
  console.log(
    `\n開發版預設首頁：`
    + `\n  Local:    http://${hostname}:${port}/_index.html`
    + `\n  Network:  http://${ipAaddress}:${port}/_index.html`
    + `\n`,
  );
}

