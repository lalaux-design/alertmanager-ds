# Alertmanager Grafana Data Source Plugin

This is an implementation of an Alertmanager plugin for Grafana version 7.0 and up.

## What is Alertmanager
The [Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) handles alerts sent by client applications such as the Prometheus server.

It is very helpful to use it as a data source for grafana.

This data-source implementation support both the alertmanager V2 API and the new Grafana 7.0 API.

### The severity label
Typically, an alert would have a severity label. The implementation does not make any assumption on the severity label, but if all values of the label are number,
it will be reported as a number, which means that if you stick to numbers, you can use it with graphs and not only with tables.
There are no number-to-text mapping done in this plugin. Instead, you can do it on the Dashboard.

## Compile it yourself
1. Install dependencies
```BASH
yarn install
```
2. Build plugin in development mode or run in watch mode
```BASH
yarn dev
```
or
```BASH
yarn watch
```
3. Build plugin in production mode
```BASH
yarn build
```
## Configuration
Currently, the only plugin configuration is the alertmanger address (ip and port).

## Query
Currently, you can only have one filter in the query.