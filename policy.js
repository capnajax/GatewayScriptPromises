
/**
 *  GatewayScript policy example that takes the result from two concurrent
 *  http request and aggregates their results into a single output.
 */

// apim -- required for all API Connect GatewayScript scripts
// urlopen -- the GatewayScript library for making http requests
// service -- this is the variable set with the set-variable policy
const apim = require('./apim.custom.js'),
    urlopen = require('urlopen'),
    service = apim.getvariable('promisedservice');

(() => {

    var startTime = new Date();

    /**
     *  @method httpGetRequest
     *  Make a GET request to a URL
     *  @param url the URL to get
     *  @param resolve callback called when the request succeeds
     *  @param reject callback called when the request fails
     */
    function httpGetRequest(url, resolve, reject) {

        var options = {
                target: url,
                method: 'GET'
            };

        urlopen.open(options, (error, response) => {

            if(error) {
                reject(error);
                return;
            }

            response.readAsJSON((error, response) => {

                if(error) {
                    reject(error);
                    return;
                }

                resolve(response);

            });

        });

    }

    // start the "a" request, which will respond in 200ms
    var promiseA = new Promise((resolve, reject) => {
        httpGetRequest(service+'/a', resolve, reject);
    });

    // start the "b" request, which will respond in 400ms
    var promiseB = new Promise((resolve, reject) => {
        httpGetRequest(service+'/b', resolve, reject);
    });

    // when both the "a" and the "b" requests are complete, build the
    // output.
    Promise.all([promiseA, promiseB]).then(values => {

        // promiseA gives us {"a":"received a"}
        // promiseB gives us {"b":"received b"}

        // values then becomes [{"a":"received a"},{"b":"received b"}]

        var endTime = new Date(),
            result = {time: endTime.getTime() - startTime.getTime()};

        // the time above should be very close to 400ms, which is the time 
        // it takes for the slowest service to respond

        // let's combine the values into a single object

        values.unshift(result);
        Object.assign.apply(null, values);

        // and output the combined object

        apim.output('application/json');
        session.output.write(result);

        // writes out {"a":"received a","b":"received b","time":4xx}

    }).catch(reason => {

        // if any of the promises fail, this will run.

        apim.output('application/json');
        session.output.write({failure:reason});

    });

})();