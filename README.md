# Example 1

Access some external services and mix their results.

## Setup

1. Run `service.js` on a server your DataPower server can access. This sets 
up a simple web service on port `3003` with a deliberately slowed response.
1. Create a `Set Variable` policy to set `promisedservice` to the server you
set up `service.js` on.
<div style="text-align:center"><img alt="the set-variable policy that sets promisedservice to your server's url" src="https://raw.githubusercontent.com/capnajax/GatewayScriptPromises/master/images/set-variable.png" width="220" /></div><br/>
1. Set up a `GatewayScript` policy, and paste in the source of `policy.js`.

Your policy chain should look like this:


<div style="text-align:center"><img alt="policy chain with a 'set-variable' and a 'gatewayscript' policy" src="https://raw.githubusercontent.com/capnajax/GatewayScriptPromises/master/images/policychain.png" width="486" /></div><br/>

The **Source**'s `assembly` will look very much like that of 
[this Open API spec][yaml]

## What it does

GatewayScript uses the standard ECMAScript 6 Promises.

	service = apim.getvariable('promisedservice')

This retrieves the value set by the **Set Variable** policy.

    // start the "a" request, which will respond in 200ms
    var promiseA = new Promise((resolve, reject) => {
        httpGetRequest(service+'/a', resolve, reject);
    });

    // start the "b" request, which will respond in 400ms
    var promiseB = new Promise((resolve, reject) => {
        httpGetRequest(service+'/b', resolve, reject);
    });

This creates two promises. A promise represents data that isn't
available yet. At a later time, a promise can be either 
`resolve`d (data is now available) or `reject`ed (an exception
occurred).

	Promise.all([promiseA, promiseB]).then(values => {
		. . .
	}).catch(error => {
		. . .
	})

This waits until either all promises are resolved, or at least
one promise is rejected. The `values` parameter is an array with
the `resolve` data from each promise. The `error` is the `reject` 
data from the promise that failed.

## Resources

[ECMAScript 6 Promises (Mozilla)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[GatewayScript Code Examples](http://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/com.ibm.apic.toolkit.doc/rapim_gwscript_codesnip.html)

[This Open API spec][yaml]


[yaml]: https://raw.githubusercontent.com/capnajax/GatewayScriptPromises/master/gatewayscriptpromises_1.0.0.yaml "Example Open API doc"

