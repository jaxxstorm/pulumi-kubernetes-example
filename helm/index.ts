import * as k8s from "@pulumi/kubernetes";

const redis = new k8s.helm.v2.Chart("redis", {
    repo: "stable",
    chart: "redis",
    version: "3.10.0",
    values: {
				usePassword: true,
				rbac: { create: true },
    },
    transformations: [
        // Make every service private to the cluster, i.e., turn all services into ClusterIP instead of
        // LoadBalancer.
        (obj: any) => {
            if (obj.kind == "Service" && obj.apiVersion == "v1") {
                if (obj.spec && obj.spec.type && obj.spec.type == "LoadBalancer") {
                    obj.spec.type = "ClusterIP";
                }
            }
        }
    ]
});

