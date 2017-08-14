SystemJS.config({
  nodeConfig: {
    "paths": {
      "npm:": "jspm_packages/npm/",
      "github:": "jspm_packages/github/",
      "champion-select/": "src/"
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "champion-select": {
      "main": "index.js",
      "format": "esm",
      "meta": {
        "*.js": {
          "babelOptions": {
            "presets": [
              "babel-preset-react"
            ],
            "stage1": true
          },
          "loader": "plugin-babel"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "body-parser": "npm:body-parser@1.15.2",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "change-case": "npm:change-case@3.0.0",
    "child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
    "classnames": "npm:classnames@2.2.5",
    "cluster": "github:jspm/nodelibs-cluster@0.2.0-alpha",
    "compression": "npm:compression@1.6.2",
    "constants": "github:jspm/nodelibs-constants@0.2.0-alpha",
    "crypto": "github:jspm/nodelibs-crypto@0.2.0-alpha",
    "domain": "github:jspm/nodelibs-domain@0.2.0-alpha",
    "events": "github:jspm/nodelibs-events@0.2.0-alpha",
    "express": "npm:express@4.14.0",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "fuse.js": "npm:fuse.js@2.2.0",
    "history": "npm:history@2.1.2",
    "http": "github:jspm/nodelibs-http@0.2.0-alpha",
    "https": "github:jspm/nodelibs-https@0.2.0-alpha",
    "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
    "jquery": "npm:jquery@3.1.0",
    "lodash": "npm:lodash@4.15.0",
    "moment": "npm:moment@2.14.1",
    "net": "github:jspm/nodelibs-net@0.2.0-alpha",
    "normalizr": "npm:normalizr@2.2.1",
    "os": "github:jspm/nodelibs-os@0.2.0-alpha",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "querystring": "github:jspm/nodelibs-querystring@0.2.0-alpha",
    "react": "npm:react@15.1.0",
    "react-dom": "npm:react-dom@15.1.0",
    "react-ga": "npm:react-ga@2.1.1",
    "react-google-publisher-tag": "npm:react-google-publisher-tag@0.1.16",
    "react-redux": "npm:react-redux@4.4.5",
    "react-router": "npm:react-router@2.4.1",
    "react-router-redux": "npm:react-router-redux@4.0.5",
    "react-router-scroll": "npm:react-router-scroll@0.2.1",
    "redux": "npm:redux@3.5.2",
    "redux-thunk": "npm:redux-thunk@2.1.0",
    "sendgrid": "npm:sendgrid@4.0.2",
    "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
    "string_decoder": "github:jspm/nodelibs-string_decoder@0.2.0-alpha",
    "throng": "npm:throng@4.0.0",
    "url": "github:jspm/nodelibs-url@0.2.0-alpha",
    "util": "github:jspm/nodelibs-util@0.2.0-alpha",
    "vm": "github:jspm/nodelibs-vm@0.2.0-alpha",
    "zlib": "github:jspm/nodelibs-zlib@0.2.0-alpha"
  },
  packages: {
    "npm:react-redux@4.4.5": {
      "map": {
        "hoist-non-react-statics": "npm:hoist-non-react-statics@1.1.0",
        "invariant": "npm:invariant@2.2.1",
        "loose-envify": "npm:loose-envify@1.2.0",
        "lodash": "npm:lodash@4.15.0"
      }
    },
    "npm:redux@3.5.2": {
      "map": {
        "symbol-observable": "npm:symbol-observable@0.2.4",
        "lodash-es": "npm:lodash-es@4.13.1",
        "loose-envify": "npm:loose-envify@1.2.0",
        "lodash": "npm:lodash@4.15.0"
      }
    },
    "npm:react@15.1.0": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0",
        "object-assign": "npm:object-assign@4.1.0",
        "fbjs": "npm:fbjs@0.8.4"
      }
    },
    "npm:express@4.14.0": {
      "map": {
        "accepts": "npm:accepts@1.3.3",
        "array-flatten": "npm:array-flatten@1.1.1",
        "content-type": "npm:content-type@1.0.2",
        "cookie": "npm:cookie@0.3.1",
        "depd": "npm:depd@1.1.0",
        "debug": "npm:debug@2.2.0",
        "encodeurl": "npm:encodeurl@1.0.1",
        "escape-html": "npm:escape-html@1.0.3",
        "etag": "npm:etag@1.7.0",
        "finalhandler": "npm:finalhandler@0.5.0",
        "fresh": "npm:fresh@0.3.0",
        "methods": "npm:methods@1.1.2",
        "cookie-signature": "npm:cookie-signature@1.0.6",
        "merge-descriptors": "npm:merge-descriptors@1.0.1",
        "parseurl": "npm:parseurl@1.3.1",
        "proxy-addr": "npm:proxy-addr@1.1.2",
        "path-to-regexp": "npm:path-to-regexp@0.1.7",
        "send": "npm:send@0.14.1",
        "type-is": "npm:type-is@1.6.13",
        "utils-merge": "npm:utils-merge@1.0.0",
        "serve-static": "npm:serve-static@1.11.1",
        "on-finished": "npm:on-finished@2.3.0",
        "range-parser": "npm:range-parser@1.2.0",
        "vary": "npm:vary@1.1.0",
        "content-disposition": "npm:content-disposition@0.5.1",
        "qs": "npm:qs@6.2.0"
      }
    },
    "npm:invariant@2.2.1": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:finalhandler@0.5.0": {
      "map": {
        "debug": "npm:debug@2.2.0",
        "escape-html": "npm:escape-html@1.0.3",
        "on-finished": "npm:on-finished@2.3.0",
        "unpipe": "npm:unpipe@1.0.0",
        "statuses": "npm:statuses@1.3.0"
      }
    },
    "npm:send@0.14.1": {
      "map": {
        "debug": "npm:debug@2.2.0",
        "depd": "npm:depd@1.1.0",
        "encodeurl": "npm:encodeurl@1.0.1",
        "escape-html": "npm:escape-html@1.0.3",
        "etag": "npm:etag@1.7.0",
        "fresh": "npm:fresh@0.3.0",
        "on-finished": "npm:on-finished@2.3.0",
        "range-parser": "npm:range-parser@1.2.0",
        "destroy": "npm:destroy@1.0.4",
        "http-errors": "npm:http-errors@1.5.0",
        "statuses": "npm:statuses@1.3.0",
        "mime": "npm:mime@1.3.4",
        "ms": "npm:ms@0.7.1"
      }
    },
    "npm:serve-static@1.11.1": {
      "map": {
        "encodeurl": "npm:encodeurl@1.0.1",
        "escape-html": "npm:escape-html@1.0.3",
        "parseurl": "npm:parseurl@1.3.1",
        "send": "npm:send@0.14.1"
      }
    },
    "npm:loose-envify@1.2.0": {
      "map": {
        "js-tokens": "npm:js-tokens@1.0.3"
      }
    },
    "npm:accepts@1.3.3": {
      "map": {
        "mime-types": "npm:mime-types@2.1.11",
        "negotiator": "npm:negotiator@0.6.1"
      }
    },
    "npm:type-is@1.6.13": {
      "map": {
        "mime-types": "npm:mime-types@2.1.11",
        "media-typer": "npm:media-typer@0.3.0"
      }
    },
    "npm:proxy-addr@1.1.2": {
      "map": {
        "forwarded": "npm:forwarded@0.1.0",
        "ipaddr.js": "npm:ipaddr.js@1.1.1"
      }
    },
    "npm:on-finished@2.3.0": {
      "map": {
        "ee-first": "npm:ee-first@1.1.1"
      }
    },
    "npm:debug@2.2.0": {
      "map": {
        "ms": "npm:ms@0.7.1"
      }
    },
    "npm:http-errors@1.5.0": {
      "map": {
        "statuses": "npm:statuses@1.3.0",
        "inherits": "npm:inherits@2.0.1",
        "setprototypeof": "npm:setprototypeof@1.0.1"
      }
    },
    "github:jspm/nodelibs-http@0.2.0-alpha": {
      "map": {
        "http-browserify": "npm:stream-http@2.3.1"
      }
    },
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.9.1"
      }
    },
    "npm:isomorphic-fetch@2.2.1": {
      "map": {
        "node-fetch": "npm:node-fetch@1.6.0",
        "whatwg-fetch": "npm:whatwg-fetch@1.0.0"
      }
    },
    "npm:mime-types@2.1.11": {
      "map": {
        "mime-db": "npm:mime-db@1.23.0"
      }
    },
    "npm:promise@7.1.1": {
      "map": {
        "asap": "npm:asap@2.0.4"
      }
    },
    "github:jspm/nodelibs-stream@0.2.0-alpha": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "github:jspm/nodelibs-url@0.2.0-alpha": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "github:jspm/nodelibs-crypto@0.2.0-alpha": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.11.0"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.5"
      }
    },
    "npm:crypto-browserify@3.11.0": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.4",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "randombytes": "npm:randombytes@2.0.3",
        "browserify-sign": "npm:browserify-sign@4.0.0"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    },
    "npm:create-hash@1.1.2": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "ripemd160": "npm:ripemd160@1.0.1",
        "sha.js": "npm:sha.js@2.4.5",
        "cipher-base": "npm:cipher-base@1.0.2"
      }
    },
    "npm:create-hmac@1.1.4": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "randombytes": "npm:randombytes@2.0.3",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:pbkdf2@3.0.4": {
      "map": {
        "create-hmac": "npm:create-hmac@1.1.4"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "randombytes": "npm:randombytes@2.0.3",
        "miller-rabin": "npm:miller-rabin@4.0.0",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:encoding@0.1.12": {
      "map": {
        "iconv-lite": "npm:iconv-lite@0.4.13"
      }
    },
    "github:jspm/nodelibs-domain@0.2.0-alpha": {
      "map": {
        "domain-browserify": "npm:domain-browser@1.1.7"
      }
    },
    "github:jspm/nodelibs-zlib@0.2.0-alpha": {
      "map": {
        "zlib-browserify": "npm:browserify-zlib@0.1.4"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "browserify-des": "npm:browserify-des@1.0.0"
      }
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "elliptic": "npm:elliptic@6.3.1",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:browserify-sign@4.0.0": {
      "map": {
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "inherits": "npm:inherits@2.0.1",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "elliptic": "npm:elliptic@6.3.1",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:browserify-aes@1.0.6": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "inherits": "npm:inherits@2.0.1",
        "cipher-base": "npm:cipher-base@1.0.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "buffer-xor": "npm:buffer-xor@1.0.3"
      }
    },
    "npm:evp_bytestokey@1.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:elliptic@6.3.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "bn.js": "npm:bn.js@4.11.6",
        "hash.js": "npm:hash.js@1.0.3",
        "brorand": "npm:brorand@1.0.5"
      }
    },
    "npm:sha.js@2.4.5": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "randombytes": "npm:randombytes@2.0.3",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:parse-asn1@5.0.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.4",
        "asn1.js": "npm:asn1.js@4.8.0"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "cipher-base": "npm:cipher-base@1.0.2",
        "des.js": "npm:des.js@1.0.0"
      }
    },
    "npm:browserify-zlib@0.1.4": {
      "map": {
        "readable-stream": "npm:readable-stream@2.1.5",
        "pako": "npm:pako@0.2.9"
      }
    },
    "npm:miller-rabin@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "brorand": "npm:brorand@1.0.5"
      }
    },
    "npm:cipher-base@1.0.2": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:hash.js@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.1"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "github:jspm/nodelibs-string_decoder@0.2.0-alpha": {
      "map": {
        "string_decoder-browserify": "npm:string_decoder@0.10.31"
      }
    },
    "npm:react-router@2.4.1": {
      "map": {
        "history": "npm:history@2.1.2",
        "warning": "npm:warning@2.1.0",
        "hoist-non-react-statics": "npm:hoist-non-react-statics@1.2.0",
        "invariant": "npm:invariant@2.2.1"
      }
    },
    "npm:history@2.1.2": {
      "map": {
        "warning": "npm:warning@2.1.0",
        "invariant": "npm:invariant@2.2.1",
        "deep-equal": "npm:deep-equal@1.0.1",
        "query-string": "npm:query-string@3.0.3"
      }
    },
    "npm:warning@2.1.0": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0"
      }
    },
    "npm:query-string@3.0.3": {
      "map": {
        "strict-uri-encode": "npm:strict-uri-encode@1.1.0"
      }
    },
    "npm:body-parser@1.15.2": {
      "map": {
        "content-type": "npm:content-type@1.0.2",
        "http-errors": "npm:http-errors@1.5.0",
        "type-is": "npm:type-is@1.6.13",
        "on-finished": "npm:on-finished@2.3.0",
        "depd": "npm:depd@1.1.0",
        "bytes": "npm:bytes@2.4.0",
        "raw-body": "npm:raw-body@2.1.7",
        "debug": "npm:debug@2.2.0",
        "iconv-lite": "npm:iconv-lite@0.4.13",
        "qs": "npm:qs@6.2.0"
      }
    },
    "npm:raw-body@2.1.7": {
      "map": {
        "iconv-lite": "npm:iconv-lite@0.4.13",
        "bytes": "npm:bytes@2.4.0",
        "unpipe": "npm:unpipe@1.0.0"
      }
    },
    "npm:asn1.js@4.8.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "inherits": "npm:inherits@2.0.1",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:change-case@3.0.0": {
      "map": {
        "lower-case-first": "npm:lower-case-first@1.0.2",
        "swap-case": "npm:swap-case@1.1.2",
        "sentence-case": "npm:sentence-case@2.1.0",
        "lower-case": "npm:lower-case@1.1.3",
        "dot-case": "npm:dot-case@2.1.0",
        "header-case": "npm:header-case@1.0.0",
        "upper-case-first": "npm:upper-case-first@1.1.2",
        "constant-case": "npm:constant-case@2.0.0",
        "camel-case": "npm:camel-case@3.0.0",
        "title-case": "npm:title-case@2.1.0",
        "no-case": "npm:no-case@2.3.0",
        "is-lower-case": "npm:is-lower-case@1.1.3",
        "is-upper-case": "npm:is-upper-case@1.1.2",
        "upper-case": "npm:upper-case@1.1.3",
        "pascal-case": "npm:pascal-case@2.0.0",
        "param-case": "npm:param-case@2.1.0",
        "path-case": "npm:path-case@2.1.0",
        "snake-case": "npm:snake-case@2.1.0"
      }
    },
    "npm:lower-case-first@1.0.2": {
      "map": {
        "lower-case": "npm:lower-case@1.1.3"
      }
    },
    "npm:swap-case@1.1.2": {
      "map": {
        "lower-case": "npm:lower-case@1.1.3",
        "upper-case": "npm:upper-case@1.1.3"
      }
    },
    "npm:sentence-case@2.1.0": {
      "map": {
        "upper-case-first": "npm:upper-case-first@1.1.2",
        "no-case": "npm:no-case@2.3.0"
      }
    },
    "npm:dot-case@2.1.0": {
      "map": {
        "no-case": "npm:no-case@2.3.0"
      }
    },
    "npm:header-case@1.0.0": {
      "map": {
        "no-case": "npm:no-case@2.3.0",
        "upper-case": "npm:upper-case@1.1.3"
      }
    },
    "npm:camel-case@3.0.0": {
      "map": {
        "no-case": "npm:no-case@2.3.0",
        "upper-case": "npm:upper-case@1.1.3"
      }
    },
    "npm:title-case@2.1.0": {
      "map": {
        "no-case": "npm:no-case@2.3.0",
        "upper-case": "npm:upper-case@1.1.3"
      }
    },
    "npm:upper-case-first@1.1.2": {
      "map": {
        "upper-case": "npm:upper-case@1.1.3"
      }
    },
    "npm:constant-case@2.0.0": {
      "map": {
        "upper-case": "npm:upper-case@1.1.3",
        "snake-case": "npm:snake-case@2.1.0"
      }
    },
    "npm:no-case@2.3.0": {
      "map": {
        "lower-case": "npm:lower-case@1.1.3"
      }
    },
    "npm:is-lower-case@1.1.3": {
      "map": {
        "lower-case": "npm:lower-case@1.1.3"
      }
    },
    "npm:is-upper-case@1.1.2": {
      "map": {
        "upper-case": "npm:upper-case@1.1.3"
      }
    },
    "npm:pascal-case@2.0.0": {
      "map": {
        "camel-case": "npm:camel-case@3.0.0",
        "upper-case-first": "npm:upper-case-first@1.1.2"
      }
    },
    "npm:param-case@2.1.0": {
      "map": {
        "no-case": "npm:no-case@2.3.0"
      }
    },
    "npm:path-case@2.1.0": {
      "map": {
        "no-case": "npm:no-case@2.3.0"
      }
    },
    "npm:snake-case@2.1.0": {
      "map": {
        "no-case": "npm:no-case@2.3.0"
      }
    },
    "npm:react-router-scroll@0.2.1": {
      "map": {
        "scroll-behavior": "npm:scroll-behavior@0.7.0",
        "history": "npm:history@2.1.2"
      }
    },
    "npm:scroll-behavior@0.7.0": {
      "map": {
        "dom-helpers": "npm:dom-helpers@2.4.0"
      }
    },
    "npm:throng@4.0.0": {
      "map": {
        "lodash.defaults": "npm:lodash.defaults@4.2.0"
      }
    },
    "github:jspm/nodelibs-os@0.2.0-alpha": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    },
    "npm:react-ga@2.1.1": {
      "map": {
        "object-assign": "npm:object-assign@4.1.0"
      }
    },
    "npm:node-fetch@1.6.0": {
      "map": {
        "is-stream": "npm:is-stream@1.1.0",
        "encoding": "npm:encoding@0.1.12"
      }
    },
    "npm:readable-stream@2.1.5": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "util-deprecate": "npm:util-deprecate@1.0.2",
        "buffer-shims": "npm:buffer-shims@1.0.0",
        "isarray": "npm:isarray@1.0.0",
        "core-util-is": "npm:core-util-is@1.0.2",
        "string_decoder": "npm:string_decoder@0.10.31"
      }
    },
    "npm:buffer@4.9.1": {
      "map": {
        "isarray": "npm:isarray@1.0.0",
        "ieee754": "npm:ieee754@1.1.6",
        "base64-js": "npm:base64-js@1.1.2"
      }
    },
    "npm:stream-http@2.3.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.5",
        "builtin-status-codes": "npm:builtin-status-codes@2.0.0",
        "xtend": "npm:xtend@4.0.1",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1"
      }
    },
    "npm:compression@1.6.2": {
      "map": {
        "bytes": "npm:bytes@2.3.0",
        "on-headers": "npm:on-headers@1.0.1",
        "compressible": "npm:compressible@2.0.8",
        "vary": "npm:vary@1.1.0",
        "accepts": "npm:accepts@1.3.3",
        "debug": "npm:debug@2.2.0"
      }
    },
    "npm:compressible@2.0.8": {
      "map": {
        "mime-db": "npm:mime-db@1.23.0"
      }
    },
    "npm:react-google-publisher-tag@0.1.16": {
      "map": {
        "lodash": "npm:lodash@4.15.0",
        "keymirror": "npm:keymirror@0.1.1"
      }
    },
    "npm:fbjs@0.8.4": {
      "map": {
        "loose-envify": "npm:loose-envify@1.2.0",
        "object-assign": "npm:object-assign@4.1.0",
        "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
        "core-js": "npm:core-js@1.2.7",
        "immutable": "npm:immutable@3.8.1",
        "ua-parser-js": "npm:ua-parser-js@0.7.10",
        "promise": "npm:promise@7.1.1"
      }
    },
    "npm:normalizr@2.2.1": {
      "map": {
        "lodash": "npm:lodash@4.15.0"
      }
    },
    "npm:sendgrid@4.0.2": {
      "map": {
        "sendgrid-rest": "npm:sendgrid-rest@2.2.1"
      }
    }
  }
});
