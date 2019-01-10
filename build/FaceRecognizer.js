"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var faceapi = require("face-api.js");
var canvas_1 = require("canvas");
var fs_1 = require("fs");
require("@tensorflow/tfjs-node");
faceapi.env.monkeyPatch({ Canvas: canvas_1.Canvas, Image: canvas_1.Image, ImageData: canvas_1.ImageData });
var FaceRecognizer = /** @class */ (function () {
    function FaceRecognizer() {
        var _this = this;
        this.labeledFaceDescriptors = new Array();
        this.MODEL_URI = "./models/";
        this.DISTANCE_THRESHOLD = 0.6;
        this.onnetworkready = function () { };
        this.onnetworktrained = function () { };
        Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromDisk(this.MODEL_URI),
            faceapi.nets.faceLandmark68Net.loadFromDisk(this.MODEL_URI),
            faceapi.nets.faceRecognitionNet.loadFromDisk(this.MODEL_URI)
        ]).then(function () { return _this.onnetworkready(); });
    }
    FaceRecognizer.getInstance = function () {
        if (!this.instance) {
            this.instance = new FaceRecognizer();
        }
        return this.instance;
    };
    /**
    * @param classPath Specify path for your classes
    */
    FaceRecognizer.prototype.train = function (classPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, labels, labeledDescriptions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        labels = this.getClassNames(classPath);
                        return [4 /*yield*/, this.getAllLabeledDescriptors(labels, classPath)];
                    case 1:
                        labeledDescriptions = _b.sent();
                        (_a = this.labeledFaceDescriptors).push.apply(_a, labeledDescriptions);
                        this.onnetworktrained();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param path Path to the object that stores biases for your model
     */
    FaceRecognizer.prototype.deserialize = function (path) {
        var deserialized = JSON.parse(fs_1.readFileSync(path).toString()).map(function (fr) {
            return new faceapi.LabeledFaceDescriptors(fr._label, Object.values(fr._descriptors).map(function (val) { return new Float32Array(Object.values(val)); }));
        });
        this.labeledFaceDescriptors = deserialized;
    };
    /**
     *
     * @param path Desired path for saving biases of your model
     */
    FaceRecognizer.prototype.serialize = function (path) {
        var serializable = this.labeledFaceDescriptors.map(function (descriptor) { return ({
            _label: descriptor.label,
            _descriptors: Object.values(descriptor.descriptors).map(function (val) {
                return Object.values(val);
            })
        }); });
        fs_1.writeFileSync(path, JSON.stringify(serializable));
    };
    /**
     *
     * @param src Image file path to for prediction
     */
    FaceRecognizer.prototype.predict = function (src) {
        return __awaiter(this, void 0, void 0, function () {
            var faceMatcher, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        faceMatcher = new faceapi.FaceMatcher(this.labeledFaceDescriptors, this.DISTANCE_THRESHOLD);
                        _b = (_a = faceMatcher).findBestMatch;
                        return [4 /*yield*/, this.getFaceDescriptorsAsync(this.loadImage(src))];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    FaceRecognizer.prototype.loadImage = function (src) {
        var image = new canvas_1.Image();
        image.src = src;
        return image;
    };
    FaceRecognizer.prototype.getClassNames = function (dir) {
        return fs_1.readdirSync(dir);
    };
    FaceRecognizer.prototype.getFaceDescriptorsAsync = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, faceapi
                            .detectSingleFace(image)
                            .withFaceLandmarks()
                            .withFaceDescriptor()];
                    case 1: return [2 /*return*/, (_a.sent()).descriptor];
                }
            });
        });
    };
    FaceRecognizer.prototype.getDescriptorSetAsync = function (images) {
        var _this = this;
        return Promise.all(images.map(function (image) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.getFaceDescriptorsAsync(image)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); }));
    };
    FaceRecognizer.prototype.getLabeledDescriptors = function (label, descriptors) {
        return new faceapi.LabeledFaceDescriptors(label, descriptors);
    };
    FaceRecognizer.prototype.getImagesAsync = function (label, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var src;
            var _this = this;
            return __generator(this, function (_a) {
                src = origin + label;
                return [2 /*return*/, fs_1.readdirSync(src).map(function (file) { return _this.loadImage(src + "/" + file); })];
            });
        });
    };
    FaceRecognizer.prototype.getAllLabeledDescriptors = function (labels, origin) {
        var _this = this;
        return Promise.all(labels.map(function (label) { return __awaiter(_this, void 0, void 0, function () {
            var images, descriptors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getImagesAsync(label, origin)];
                    case 1:
                        images = _a.sent();
                        return [4 /*yield*/, this.getDescriptorSetAsync(images)];
                    case 2:
                        descriptors = _a.sent();
                        return [2 /*return*/, this.getLabeledDescriptors(label, descriptors)];
                }
            });
        }); }));
    };
    return FaceRecognizer;
}());
exports.default = FaceRecognizer;
// TODO: High Cohesive Refactor 
//# sourceMappingURL=FaceRecognizer.js.map