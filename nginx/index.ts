import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";


let config = new pulumi.Config("pulumi-example"); // use the name field in the Pulumi.yaml here

let imageTag = config.require("imageTag");


// set some defaults
const defaults = {
  name: "nginx",
  namespace: "default",
  labels: {app: "nginx"},
  serviceSelector: {app: "nginx"},
};

// create the deployment
const apacheDeployment = new k8s.apps.v1.Deployment(
  defaults.name,
  {
    metadata: {
      namespace: defaults.namespace,
      name: defaults.name,
      labels: defaults.labels
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: defaults.labels,
      },
      template: {
        metadata: {
          labels: defaults.labels
        },
        spec: {
          containers: [
            {
              name: defaults.name,
              image: `nginx:${imageTag}`,
              ports: [
                {
                  name: "http",
                  containerPort: 80,
                },
                {
                  name: "https",
                  containerPort: 443,
                }
              ],
            }
          ],
        },
      },
    }
  });

