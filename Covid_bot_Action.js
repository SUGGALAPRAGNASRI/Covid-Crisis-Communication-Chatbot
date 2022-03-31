/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */
var request = require("request-promise");



async function main(params) {
   /*
    * Use of the 'Johns Hopkins CSSE' resource
    */
    try {
      const summary = await request({
        method: "GET",
        uri: "https://api.covid19api.com/summary",
        json: true
      });
      if(params.type === "new")
      {
        if (params.country) {
        for (var i = 0; i < summary.Countries.length; i++) {
          if (
            summary.Countries[i].Country.toLowerCase() === params.country.toLowerCase()
          ) {
            return {
              result: `New Cases Today: ${summary.Countries[i].NewConfirmed}\nNew Deaths Today: ${summary.Countries[i].NewDeaths}\nNew Recovered Today: ${summary.Countries[i].NewRecovered}`
            };
          }
        }
        return { error: "did not find country" };
      }
      let casesToday=0;
      let deathsToday=0;
      let recoveredToday=0;
      for (var i = 0; i < summary.Countries.length; i++) {
        casesToday += summary.Countries[i].NewConfirmed;
        deathsToday += summary.Countries[i].NewDeaths;
        recoveredToday += summary.Countries[i].NewRecovered;
      }
      return {
        result: `New Cases: ${casesToday}\nNew Deaths: ${deathsToday}\nNew Recovered: ${recoveredToday}\n`
      };
      }
      if (params.country) {
        for (var i = 0; i < summary.Countries.length; i++) {
          if (
            summary.Countries[i].Country.toLowerCase() === params.country.toLowerCase()
          ) {
            return {
              result: `Total Cases: ${summary.Countries[i].TotalConfirmed}\nActive cases: ${summary.Countries[i].TotalConfirmed-summary.Countries[i].TotalDeaths-summary.Countries[i].TotalRecovered}\nTotal Deaths: ${summary.Countries[i].TotalDeaths}\nTotal Recovered: ${summary.Countries[i].TotalRecovered}`
            };
          }
        }
        return { error: "did not find country" };
      }
      let totalCases = 0;
      let totalDeaths = 0;
      let totalRecovered = 0;
      for (var i = 0; i < summary.Countries.length; i++) {
        totalCases += summary.Countries[i].TotalConfirmed;
        totalDeaths += summary.Countries[i].TotalDeaths;
        totalRecovered += summary.Countries[i].TotalRecovered;
      }
      return {
        result: `Total Cases: ${totalCases}\nActive Cases: ${totalCases-totalDeaths-totalRecovered}\nTotal Deaths: ${totalDeaths}\nTotal Recovered: ${totalRecovered}\n`
      };
    } catch (err) {
      return { error: "it failed : " + err };
    }

}