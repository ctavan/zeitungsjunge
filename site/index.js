var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.home;
handle["/home"] = requestHandlers.home;
handle["/main.css"] = requestHandlers.css;
handle["/image"] = requestHandlers.image;
handle["/favicon.ico"] = requestHandlers.favicon;
handle["/subscribe"] = requestHandlers.subscribe;
handle["/subscribeConfirm"] = requestHandlers.subscribeConfirm;
handle["/unsubscribe"] = requestHandlers.unsubscribe;
handle["/unsubscribeConfirm"] = requestHandlers.unsubscribeConfirm;
handle["/faq"] = requestHandlers.faq;
handle["/showError"] = requestHandlers.showError;
handle["/contact"] = requestHandlers.contact;
handle["/contactConfirm"] = requestHandlers.contactConfirm;

server.start(router.route, handle);
