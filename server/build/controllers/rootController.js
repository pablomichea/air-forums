var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import { controller } from './decorators/controller.js';
import { get, post } from './decorators/routes.js';
import { use } from './decorators/use.js';
import { AppRouter } from '../AppRouter.js';
import { reqBodyCheck } from './decorators/reqBodyCheck.js';
import { boards } from '../boardInfo/boards.js';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import '@total-typescript/ts-reset';
import { User } from '../models/user.js';
var router = AppRouter.getRouter();
function CORS(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Header', 'Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
}
function regexedURL(str) {
    if (!str)
        return '';
    var regex = /^[a-z0-9-/\s.]+$/;
    return str.toLowerCase().replace(/\s/g, '-').split('/').filter(function (char) { return regex.test(char); }).join("/");
}
function createRouterGet(baseRoute, routeSegment, file, options) {
    var link = "/".concat(baseRoute, "/").concat(routeSegment);
    return router.get(link, function (req, res) {
        res.status(200).render(file, options);
    });
}
function getCookieInfo(req, res, next) {
    var _a;
    req.cookieInfo = (_a = req.headers.cookie) === null || _a === void 0 ? void 0 : _a.split(';').reduce(function (acc, curr) {
        var _a = curr.split('='), key = _a[0], value = _a[1];
        acc[key.trim()] = value.trim();
        return acc;
    }, {});
    next();
}
function initBoardRouters() {
    boards.forEach(function (board) {
        createRouterGet('board', board.link, 'categories', {
            id: board.id,
            desc: board.desc,
            title: board.title,
            link: board.link,
            categories: board.categories,
        });
        board.categories.forEach(function (category) {
            var link = board.link + '/' + category.link;
            createRouterGet('board', link, 'threads', {
                id: category.id,
                desc: category.desc,
                title: category.title,
                link: category.link,
                threads: category.threads,
            });
            category.threads.forEach(function (thread) {
                var link = "".concat(board.link, "/").concat(category.link, "/").concat(thread.link);
                var postDate = thread.date.creation;
                createRouterGet('board', link, 'thread', {
                    id: thread.id,
                    threadContent: thread.threadContent,
                    title: thread.title,
                    comments: thread.comments,
                    username: thread.username,
                    open: thread.open,
                    date: { creation: postDate, localeUsed: thread.date.localeUsed },
                    link: link,
                });
            });
        });
    });
}
initBoardRouters();
var Index = (function () {
    function Index() {
    }
    Index.prototype.getIndex = function (req, res) {
        res.status(200).render('index', { title: 'Index', active: '/' });
    };
    __decorate([
        get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Index.prototype, "getIndex", null);
    Index = __decorate([
        controller('')
    ], Index);
    return Index;
}());
var Foro = (function () {
    function Foro() {
    }
    Foro.prototype.getForo = function (req, res) {
        res.status(200).render('board', { title: 'Foro', active: 'boards', boards: boards });
    };
    Foro.prototype.getNewThread = function (req, res) {
        var userInfo = res.status(200).render('new-thread', {
            title: 'Post a thread',
            active: 'newThread',
            boards: boards,
        });
    };
    Foro.prototype.getUserProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var profileName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        profileName = req.params.profile;
                        return [4, User.find({ username: profileName })
                                .then(function (user) {
                                var _a = user[0], username = _a.username, role = _a.role, postCount = _a.postCount, rep = _a.rep;
                                res.status(200).render('userProfile', { username: username, role: role, postCount: postCount, rep: rep });
                            })
                                .catch(function (err) {
                                console.log('User not found.');
                                return res.status(404).render('userProfile', {});
                            })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Foro.prototype.postNewThread = function (req, res) {
        var _a = req.body, categoryLocation = _a.categoryLocation, postTitle = _a.postTitle, threadContent = _a.threadContent;
        boards.forEach(function (board) {
            board.categories.forEach(function (category) {
                var _a, _b;
                if (category.title === categoryLocation) {
                    var id = board.categories.length - 1 + 1;
                    var link = "".concat(board.link, "/").concat(regexedURL(categoryLocation), "/").concat(regexedURL(postTitle), ".").concat(id);
                    var threadCreationDate = new Date(Date.now()).toISOString();
                    category.threads.push({
                        id: id,
                        username: ((_a = req.loggedUser) === null || _a === void 0 ? void 0 : _a.username) || 'Invitado',
                        title: postTitle,
                        threadContent: threadContent,
                        link: "".concat(regexedURL(postTitle), ".").concat(id),
                        date: { creation: "".concat(threadCreationDate), localeUsed: 'check locale' },
                        open: true,
                        comments: [],
                    });
                    var comments = category.threads.filter(function (post) { return post.title === postTitle; })[0].comments;
                    createRouterGet('board', link, 'thread', {
                        id: category.threads.length - 1 + 1,
                        threadContent: threadContent,
                        title: postTitle,
                        link: "".concat(link),
                        date: { creation: "".concat(threadCreationDate), localeUsed: 'es-CL' },
                        comments: comments,
                        open: true,
                        username: ((_b = req.loggedUser) === null || _b === void 0 ? void 0 : _b.username) || 'Invitado',
                    });
                    res.status(201).redirect(link);
                }
            });
        });
    };
    Foro.prototype.postNewComment = function (req, res) {
        var _a;
        var _b = req.body, commentContent = _b.commentContent, commentLink = _b.commentLink, locale = _b.locale;
        var postRoute = commentLink.split('/');
        var link = boards
            .filter(function (board) { return board.link === postRoute[0]; })[0]
            .categories.filter(function (category) { return category.link === postRoute[1]; })[0]
            .threads.filter(function (thread) { return thread.link === postRoute.at(-1); })[0];
        var commentCreationDate = new Date(Date.now()).toISOString();
        link.comments.push({
            id: link.comments.length - 1 + 1,
            username: ((_a = req.loggedUser) === null || _a === void 0 ? void 0 : _a.username) || 'Invitado',
            commentContent: commentContent,
            commentLink: commentLink,
            date: { creation: "".concat(commentCreationDate), localeUsed: locale },
        });
        res.status(201).redirect(301, commentLink);
    };
    Foro.prototype.checkNewPosts = function (req, res) {
        var _a = req.body, count = _a.count, fromThread = _a.fromThread, fromRoute = _a.fromRoute;
        var route = fromRoute.slice().split('/').splice(2);
        var postCountDB = boards
            .filter(function (board) { return board.link === route[0]; })[0]
            .categories.filter(function (category) { return category.link === route[1]; })[0]
            .threads.filter(function (thread) { return thread.link === route[2]; })[0].comments.length;
        var newPosts = +count < postCountDB ? true : false;
        res.status(201).json({ newPosts: newPosts, sendTo: req.originalUrl, fromRoute: fromRoute, fromThread: fromThread });
    };
    __decorate([
        get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Foro.prototype, "getForo", null);
    __decorate([
        get('/new-thread'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Foro.prototype, "getNewThread", null);
    __decorate([
        get('/user-profile/:profile'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], Foro.prototype, "getUserProfile", null);
    __decorate([
        post('/new-thread'),
        reqBodyCheck('categoryLocation', 'postTitle', 'threadContent'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Foro.prototype, "postNewThread", null);
    __decorate([
        post('/new-comment'),
        use(bodyParser.json()),
        reqBodyCheck('commentContent', 'commentLink', 'locale'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Foro.prototype, "postNewComment", null);
    __decorate([
        post('/check-new-posts'),
        use(bodyParser.json()),
        reqBodyCheck('count', 'fromThread', 'fromRoute'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Foro.prototype, "checkNewPosts", null);
    Foro = __decorate([
        controller('/board')
    ], Foro);
    return Foro;
}());
var AdminPanel = (function () {
    function AdminPanel() {
    }
    AdminPanel.prototype.getAdminPage = function (req, res) {
        var categories = [];
        for (var _i = 0, boards_1 = boards; _i < boards_1.length; _i++) {
            var forum = boards_1[_i];
            categories.push(forum.title);
        }
        res.status(200).render('admin', { title: 'Admin', active: 'admin', categories: categories });
    };
    AdminPanel.prototype.postAddBoard = function (req, res) {
        var _a = req.body, boardName = _a.boardName, boardDesc = _a.boardDesc;
        var link = regexedURL(boardName);
        boards.push({
            id: boards.length - 1 + 1,
            title: boardName,
            desc: boardDesc,
            link: link,
            categories: [],
        });
        createRouterGet('board', boardName, 'categories', {
            id: boards.length - 1 + 1,
            title: boardName,
            desc: boardDesc,
            link: link,
            categories: [],
        });
        res.status(201).redirect('/admin');
    };
    AdminPanel.prototype.postAddCategory = function (req, res) {
        var _a = req.body, categoryName = _a.categoryName, categoryDesc = _a.categoryDesc, forumName = _a.forumName;
        var categoryLocation = boards.filter(function (board) { return board.title === forumName; })[0];
        var link = regexedURL(categoryName);
        categoryLocation.categories.push({
            id: categoryLocation.categories.length - 1 + 1,
            title: categoryName,
            desc: categoryDesc,
            link: link,
            threads: [],
        });
        var selectedCategory = categoryLocation.categories.filter(function (category) { return category.title === categoryName; })[0];
        createRouterGet('board', categoryLocation.link + '/' + link, 'threads', {
            id: categoryLocation.categories.length - 1 + 1,
            title: categoryName,
            desc: categoryDesc,
            link: link,
            threads: selectedCategory.threads,
        });
        res.status(201).redirect('/board');
    };
    __decorate([
        get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], AdminPanel.prototype, "getAdminPage", null);
    __decorate([
        post('/add-board'),
        reqBodyCheck('boardName', 'boardDesc'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], AdminPanel.prototype, "postAddBoard", null);
    __decorate([
        post('/add-category'),
        reqBodyCheck('categoryName', 'categoryDesc', 'forumName'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], AdminPanel.prototype, "postAddCategory", null);
    AdminPanel = __decorate([
        controller('/admin')
    ], AdminPanel);
    return AdminPanel;
}());
var RegisterUser = (function () {
    function RegisterUser() {
    }
    RegisterUser.prototype.getSignUp = function (req, res) {
        res.status(200).render('signup', { title: 'Sign-up', active: 'signup' });
    };
    RegisterUser.prototype.postSignUp = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, email, password, userExists, hashedPassword, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                        return [4, User.findOne({ email: email })];
                    case 1:
                        userExists = _b.sent();
                        if (userExists) {
                            console.log('Email already exists');
                            return [2, res.json({ error: 'Email already exists', success: false })];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        return [4, bcrypt.hash(password, 10)];
                    case 3:
                        hashedPassword = _b.sent();
                        return [4, User.build({
                                username: username,
                                email: email,
                                password: hashedPassword,
                                postCount: 0,
                                rep: 0,
                                role: 'user',
                            })
                                .save()
                                .catch(function (err) { return console.error(err); })];
                    case 4:
                        _b.sent();
                        res.cookie('isLoggedIn', 'true');
                        res.cookie('username', "".concat(username));
                        console.log('Usuario creado');
                        res.redirect(302, '/board');
                        return [3, 6];
                    case 5:
                        err_1 = _b.sent();
                        console.log(err_1);
                        return [3, 6];
                    case 6: return [2];
                }
            });
        });
    };
    __decorate([
        get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], RegisterUser.prototype, "getSignUp", null);
    __decorate([
        post('/'),
        use(CORS),
        reqBodyCheck('username', 'email', 'password'),
        use(bodyParser.json()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], RegisterUser.prototype, "postSignUp", null);
    RegisterUser = __decorate([
        controller('/signup')
    ], RegisterUser);
    return RegisterUser;
}());
