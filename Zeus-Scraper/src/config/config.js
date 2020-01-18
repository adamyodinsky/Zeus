'use strict';

module.exports = {
  NAMESPACE: process.env.NAMESPACE || 'apps',
  Host: process.env.CONSUL_HOST || 'localhost',
  Port: Number(process.env.CONSUL_PORT || 3002),
  logLevel: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === "true",
  SIDE_CAR_ACTIVE: process.env.SIDE_CAR_ACTIVE === "true",
  STATE_FILE_PATH: process.env.STATE_FILE_PATH || `${__dirname}/stateFiles/ZeusState`,
  STATE_FILE_NAME: process.env.STATE_FILE_NAME || 'ZeusState',
  S3_BUCKET: process.env.S3_BUCKET || "k8s-garbage-collection-dev",
  MONGO_URI: process.env.MONGO_URI || "mongodb://root:1234@localhost:27017/admin",
  CLUSTER: process.env.CLUSTER || 'eks-dev',
  sideCar: {
    container_name: process.env.SIDECAR_NAME || 'istio-proxy',
    resources: {
      txt: {
        requests: {
          cpu: process.env.SIDECAR_CPU_REQUESTS || '100m',
          memory: process.env.SIDECAR_MEM_REQUESTS || '128Mi'
        }
      },
      num: {},
      sum: {}
    },
    usage_samples: [
      {
        sum: {},
        avg: {}
      }
    ]
  }
};
