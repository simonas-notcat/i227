"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Daf = require("daf-core");
var daf_did_jwt_1 = require("daf-did-jwt");
var daf_w3c_1 = require("daf-w3c");
var daf_selective_disclosure_1 = require("daf-selective-disclosure");
var DafEthrDid = require("daf-ethr-did");
var DafLibSodium = require("daf-libsodium");
var daf_resolver_1 = require("daf-resolver");
var apollo_server_1 = require("apollo-server");
var lodash_merge_1 = require("lodash.merge");
var typeorm_1 = require("typeorm");
var infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c';
var didResolver = new daf_resolver_1.DafResolver({ infuraProjectId: infuraProjectId });
var identityProviders = [
    new DafEthrDid.IdentityProvider({
        kms: new DafLibSodium.KeyManagementSystem(new Daf.KeyStore()),
        identityStore: new Daf.IdentityStore('rinkeby-ethr'),
        network: 'rinkeby',
        rpcUrl: 'https://rinkeby.infura.io/v3/' + infuraProjectId
    }),
];
var serviceControllers = [];
var messageHandler = new daf_did_jwt_1.JwtMessageHandler();
messageHandler
    .setNext(new daf_w3c_1.W3cMessageHandler())
    .setNext(new daf_selective_disclosure_1.SdrMessageHandler());
var actionHandler = new daf_w3c_1.W3cActionHandler();
actionHandler.setNext(new daf_selective_disclosure_1.SdrActionHandler());
exports.agent = new Daf.Agent({
    identityProviders: identityProviders,
    serviceControllers: serviceControllers,
    didResolver: didResolver,
    messageHandler: messageHandler,
    actionHandler: actionHandler
});
var server = new apollo_server_1.ApolloServer({
    typeDefs: [
        Daf.Gql.baseTypeDefs,
        Daf.Gql.Core.typeDefs,
        Daf.Gql.IdentityManager.typeDefs,
        daf_w3c_1.W3cGql.typeDefs,
        daf_selective_disclosure_1.SdrGql.typeDefs,
    ],
    resolvers: lodash_merge_1["default"](Daf.Gql.Core.resolvers, Daf.Gql.IdentityManager.resolvers, daf_w3c_1.W3cGql.resolvers, daf_selective_disclosure_1.SdrGql.resolvers),
    context: function (_a) {
        var req = _a.req;
        return { agent: exports.agent };
    },
    introspection: true
});
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var info;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.createConnection({
                    type: 'sqlite',
                    database: './database.sqlite',
                    synchronize: true,
                    logging: false,
                    entities: __spreadArrays(Daf.Entities)
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, server.listen({ port: 8080, path: '/graphql' })];
            case 2:
                info = _a.sent();
                console.log("\uD83D\uDE80  Server ready at " + info.url);
                return [2 /*return*/];
        }
    });
}); };
main()["catch"](console.log);
