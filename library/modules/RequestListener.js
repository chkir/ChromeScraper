
//Request listener
//must be initialized in dev tools panel
class RequestListener {
  //public
  constructor() {
    this._isListening = false
  }
  start(regex, handler) {
    this._handler = handler
    this._regex = new RegExp(regex)

    if (this._isListening) {
      this.stop()
      this._handler(null, null)
    }
    this._isListening = true
    let instance = this
    chrome.devtools.network.onRequestFinished.addListener(response => {
      this._onRequestFinished(response)
    });

  }
  stop() {
    if (this._isListening) {
      this._isListening = false
      chrome.devtools.network.onRequestFinished.removeListener(this._onRequestFinished);
    }
  }

  //private
  _onRequestFinished(request) {
    request.getContent((body) => {
      if (request.request && request.request.url && this._regex.test(request.request.url)) {
        this._handler(request.request.url, body)
      }
    });
  }
}