const db = require('./userHelper');
const axios = require('axios').default;

module.exports = {
  sendGETRequestToAllPings: async () => {
    try {
      const allPings = await db.showAllPingsFromAllUsers();
      for (let ping of allPings) {
        //console.log(`running on ${ping.address}`);
        var lastVisit = new Date(ping.lastPinged);

        var limitInminutes = 5 * 60000; // 60000 being the number of milliseconds in a minute
        var now = new Date();
        var limitInminutesAgo = new Date(now - limitInminutes);

        if (lastVisit < limitInminutesAgo && ping.address) {
          //console.log(`fetching ${ping.address} ...`);
          let data;
          try {
            data = await axios.get(ping.address);
          } catch (error) {
            //console.error(error);
            //console.log(`${ping.address} failed`)
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              //console.log(error.response.data);
              //console.log(error.response.status, ping.address);
              //console.log(error)
              await db.updatePingWithStatus(
                ping._id,
                error.response.statusText,
                error.response.status
              );
              continue;
              //console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              //console.log(ping.address, error.request);
              continue;
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
              continue;
            }
            //console.log(error.config);
          }
          if (data) {
            await db.updatePingWithStatus(
              ping._id,
              data.statusText,
              data.status
            );
            await db.updatePingWithCurrentTime(ping._id);
          }
          continue;
        }
        continue;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
