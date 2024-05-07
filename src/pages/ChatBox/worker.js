const loopworker = () => {
  onmessage = (e) => {
    const browserInfo = {
      userAgent: navigator.userAgent,
      appName: navigator.appName,
      appVersion: navigator.appVersion,
      platform: navigator.platform,
      language: navigator.language,
    };
    postMessage(browserInfo);
  };
};

let code = loopworker.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
const blob = new Blob([code], { type: "application/javascript" });
const workerScript = URL.createObjectURL(blob);
module.exports = workerScript;
