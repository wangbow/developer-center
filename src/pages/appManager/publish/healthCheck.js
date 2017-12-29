import React, { Component } from 'react';


class HealthCheck extends component {
    constructor(props){
        super(props);
        this.state = {
            healthChecks: [
                {
                    http: {
                        "protocol": "HTTP",
                        "path": "/path/to/health",
                        "gracePeriodSeconds": 300,
                        "intervalSeconds": 60,
                        "timeoutSeconds": 20,
                        "maxConsecutiveFailures": 3,
                        "ignoreHttp1xx": true,
                        "portIndex": 0
                    },
                    tcp: {
                        "protocol": "TCP",
                        "gracePeriodSeconds": 300,
                        "intervalSeconds": 60,
                        "timeoutSeconds": 20,
                        "maxConsecutiveFailures": 3,
                        "portIndex": 0
                    },
                    commond: {
                        "protocol": "COMMAND",
                        "command": {
                            "value": "commands"
                        },
                        "gracePeriodSeconds": 300,
                        "intervalSeconds": 60,
                        "timeoutSeconds": 20,
                        "maxConsecutiveFailures": 3
                    }
                }
            ]
        };

    }
    render () {
        return (
            <div>
            <Col md={12}>
                 <h3>健康检查1-HTTP</h3>
                 </Col>

            </div>

        )
    }
}
