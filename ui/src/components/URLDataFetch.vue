<template>
  <div id="app">
    <h1 :key="statusCode">
      {{ statusCode || "No results yet, make a request!" }}
    </h1>
    <div>
      {{ statusMessage }}
    </div>
    <br />
    <div>
      <form action="{{getURLData}}">
        <it-select
          v-model="httpMethod"
          :options="httpMethods"
          track-by="value"
          id="http-method-select"
        />
        <it-input name="url" v-model="url" type="text" id="url-input" />
        <it-button type="primary" id="send-button" v-on:click="getURLData">
          SEND
        </it-button>
      </form>
    </div>
    <div v-if="urlData" id="url-data-section">
      <div id="url-info">
        URL INFO
        <div id="url-info-container">
          <div id="domain">
            <strong>DOMAIN</strong>
            <p>
              {{ urlData.domain }}
            </p>
          </div>
          <div id="scheme">
            <strong>SCHEME</strong>
            <p>
              {{ urlData.scheme }}
            </p>
          </div>
          <div id="path">
            <strong>PATH</strong>
            <p>
              {{ urlData.path }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-for="response in responses"
        v-bind:key="response"
        class="response-info"
      >
        RESPONSE
        <p>
          {{response}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  data: () => {
    return {
      httpMethod: "GET",
      httpMethods: [
        { name: "GET", value: "get" },
        { name: "POST", value: "post" },
        { name: "PUT", value: "put" },
        { name: "DELETE", value: "delete" },
      ],
      statusCode: undefined,
      statusMessage: undefined,
      url: "http://localhost:3000",
      urlData: undefined,
      responses: [],
    };
  },

  methods: {
    async getURLData(event) {
      event.preventDefault();

      try {
        const url = new URL(this.url);
        this.urlData = {
          scheme: url.protocol,
          domain: url.hostname,
          path: url.pathname,
        };
        const response = await Axios(this.url, {
          method: this.httpMethod,
        });
        this.statusCode = response.status.toString();
        this.statusMessage = response.statusText;
        this.responses = [response];
        // send data to server localhost:3000 with POST
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#app,
form {
  display: flex;
  align-items: center;
}
#app {
  flex-direction: column;
}
form {
  flex-direction: row;

  div {
    margin-right: 1vw;
  }
}
#url-data-section {
  display: flex;
  text-align: left;
  margin: 4vh;
  width: 100vw;

  #url-info,
  .response-info {
    width: 30%;
    border-radius: 4px;
    padding: 0.5em;
  }
  #url-info {
    background-color: #FAFAFA;

    #url-info-container {
      margin-top: 1em;
    }

    #domain,
    #scheme,
    #path {
      background-color: #E9E9E9;
      margin: 0.5em 0;
      border-radius: 4px;
    }
  }
}
@media (max-width: 500px) {
  #url-data-section {
    flex-direction: column;
    align-items: center;

    #url-info,
    .response-info {
      width: 100%;
    }
  }
}
</style>
