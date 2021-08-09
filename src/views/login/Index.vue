<template>
    <div class="view-login" v-loading="loading">
        <div class="logo">
            {{siteName}}
        </div>
        <div class="content_login">
            <div class="content_login_content clearfix">
                <div class="content_login_img">
                </div>
                <div :class="['content_login_input', `animatedShow ${bounceInRight}`]">
                    <div class="content-login-cont">
                        <h2>登录</h2>
                        <p>{{siteName}}</p>
                    </div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                        <el-form-item label="" prop="username">
                            <el-input placeholder="请输入账号" v-model="ruleForm.username" clearable>
                                <template slot="prepend">
                                    <i class="el-icon-user"></i>
                                    <span>账号</span>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="" prop="password">
                            <el-input @keyup.enter.native="btnToLogin" placeholder="请输入密码" v-model="ruleForm.password"
                                      type="password" clearable>
                                <div slot="prepend">
                                    <i class="el-icon-lock"></i>
                                    <span>密码</span>
                                </div>
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <p class="content_login_forgetPass">
                        <el-checkbox v-model="isRemember">自动登录</el-checkbox>
                        <!-- <span @click="goPhoneLogin">手机号登录</span> -->
                        <!-- <span @click="goForgetPass">忘记密码</span> -->
                        <el-button type="text" @click="handleForgetPassword">忘记密码</el-button>
                    </p>
                    <el-button
                            :class="['btn',`animated ${shake}`]"
                            class="content_login_loginbtn"
                            @click="btnToLogin()"
                    >登 录
                    </el-button>
                </div>
            </div>
        </div>
        <div class="copyright">
            <span>Copyright &copy; {{siteName}}</span>
        </div>
    </div>
</template>

<script>
    import tokenUtil from "@/utils/tokenUtil.js";
    import {checkReg} from "@/utils/checkReg.js";
    import rsaConfig from "@/rsaConfig.js";
    import {
        namePassLoginAPI, //登录
        getSignalDataAPI, //获取各种 私钥  公钥  客户端  签名
    } from "@/request/api.js";

    import rememberPassword from "@/utils/rememberPassword";
    import {getPublicAndPrivateKey, setPublicAndPrivateKey} from "../../utils/PublicAndPrivateKey";

    export default {
        name: "loginNormal",
        props: [],
        setup() {
            const siteName = rsaConfig.siteName;
            return {
                siteName
            }
        },
        data() {
            let checkPhoneForm = [
                {
                    validator: checkReg.emptyBlur,
                    message: "请输入账号",
                    trigger: "blur"
                },
                {
                    validator: checkReg.checkPhone,
                    trigger: "blur"
                }
            ];
            let checkPasswordForm = [
                {
                    validator: checkReg.emptyBlur,
                    message: "请输入密码",
                    trigger: "blur"
                }
            ];
            let checkCodeForm = [
                {
                    validator: checkReg.emptyBlur,
                    message: "请输入验证码",
                    trigger: "blur"
                }
            ];
            return {
                loading: false,
                bounceInRight: "bounceInRight",
                shake: "", //登录错误摇一摇，登录按钮的动画
                ruleForm: {
                    username: "", //用户名
                    password: "" //密码
                },
                rules: {
                    username: checkPhoneForm,
                    password: checkPasswordForm,
                    code: checkCodeForm
                },
                isRemember: false // 是否记住密码
            };
        },
        methods: {
            pageTrans() {
                this.$router.push({
                    name: "welcome"
                });
                let ua = navigator.userAgent;
                if (ua.indexOf("Firefox") != -1 && ua.indexOf("Windows") != -1) {
                    window.location.reload();
                }
            },
            //登录
            btnToLogin() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        // 如果有cookie，先清空===有个首次登录跳刷新的问题，尝试修改
                        let token = tokenUtil.getToken();
                        // 判断cookie是否存在===有个首次登录跳刷新的问题，尝试修改
                        if (token != undefined) {
                            tokenUtil.clearToken();
                        }

                        let {publicKey, privateKey, signKey, clientKey} = getPublicAndPrivateKey();
                        if (!publicKey || !privateKey || !signKey || !clientKey) { //当其中一个不存在时 重新请求数据
                            this.handleSignal(() => {
                                this.namePassLogin_med({
                                    grant_type: "password",
                                    password: this.ruleForm.password,
                                    username: this.ruleForm.username,
                                    scope: "all",
                                    auth_type: "password"
                                });
                            });
                            return false
                        }

                        this.namePassLogin_med({
                            grant_type: "password",
                            password: this.ruleForm.password,
                            username: this.ruleForm.username,
                            scope: "all",
                            auth_type: "password"
                        });
                    } else {
                        this.shakefn();
                        return false;
                    }
                });
            },
            // 私钥  公钥  客户端  签名
            async handleSignal(callback) {
                console.log('handleSignal')
                try {
                    // 私钥  公钥  客户端  签名
                    let {data} = await getSignalDataAPI({clientId: rsaConfig.clientId});

                    setPublicAndPrivateKey(data)

                    callback && await callback()
                } catch (e) {
                    console.log('result___e', e)
                }
            },
            // 登录接口
            async namePassLogin_med(par) {
                try {
                    let {data, message, code} = await namePassLoginAPI(par);
                    console.log(data);
                    if (code === 10012) {
                        this.$message.error('登录令牌错误（账号或者密码错误）');
                        this.loading = false;
                        return false
                    }
                    if (code !== 0) {
                        this.$message.error(message);
                        this.loading = false;
                        return false
                    }

                    // 记住密码
                    if (this.isRemember) {
                        rememberPassword.saveAccount({
                            ...par
                        });
                    } else {
                        rememberPassword.clearAccount()
                    }

                    tokenUtil.setToken(
                        data.value,
                        data.refreshToken.value || '',
                        data.additionalInformation.ucode,
                        data.tokenType,
                        data.expiresIn,
                        data.refreshToken.expiration
                    );
                    this.loading = false;
                    this.$router.push({
                        name: "List"
                    });
                } catch (e) {
                    this.loading = false;
                }
            },
            // 修改密码-隐藏当前组件，打开手机验证码登录的组件
            goForgetPass() {
                // 忘记密码过去，type=2
                this.$router.push({
                    name: "loginResetPass",
                    query: {type: 2}
                });
            },
            // 手机号登录
            goPhoneLogin() {
                this.$router.push({
                    name: "login_phoneLogin"
                });
            },
            //摇一摇
            shakefn() {
                this.shake = "shake";
                setTimeout(() => {
                    this.shake = "";
                }, 500);
            },
            // 忘记密码
            handleForgetPassword() {
                this.$alert('忘记密码请联系管理员重置账号。', '温馨提示', {
                    confirmButtonText: '知道了',
                    customClass: 'forget-password',
                    callback: () => {
                    }
                });
            }
        },
        created() {
            this.isRemember = rememberPassword.getStatus();
            if (this.isRemember) {
                this.ruleForm = {
                    ...rememberPassword.getAccount()
                }
            }
        }
    };
</script>

<style lang="scss">
    .content_login {
        .animated {
            animation-duration: 0.5s;
        }

        .animatedShow {
            animation-duration: 1.5s;
        }
    }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .view-login {
        @include wh(100%, 100%);
        @include wh(100vw, 100vh);
        //@include tableCellCenter();
        position: relative;
        box-sizing: border-box;
        background-color: #fff;

        .logo {
            position: absolute;
            top: 30px;
            left: 41px;
            font-size: 18px;
            font-weight: bold;
        }

        .content_login {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            @include wh(1360px, 462px);
            margin: auto;

            .content_login_tit {
                position: absolute;
                top: -45px;
                left: 2px;
                z-index: 2;
                @include fonts(18px, 25px, $fontColorBlack01);
                font-weight: bold;
            }

            .content_login_content {
                @include wh(1360px, 462px);
                border-radius: 8px;
                padding: 0 18px;
                /*box-shadow: 0px 10px 23px 0px $opacityColor04;*/

                .content_login_img {
                    float: left;
                }

                .content_login_img {
                    @include wh(842px, 462px);
                    background: url("../../assets/img/login_bg.png") no-repeat center center / cover;
                }

                .content_login_input {
                    float: right;
                    @include wh(464px, 462px);
                    padding: 64px 58px 0;
                    background: #fff;
                    box-shadow: 0px 6px 24px 0px rgba(0, 0, 0, 0.13);

                    .content-login-cont {
                        text-align: left;
                        padding-bottom: 32px;

                        h2 {
                            font-size: 28px;
                            line-height: 30px;
                            color: #353737;
                        }

                        p {
                            padding-top: 15px;
                            color: $themeColor;
                        }
                    }

                    .marB24 {
                        margin-bottom: 24px;
                    }

                    .marB0 {
                        margin-bottom: 0px;
                        position: relative;
                    }

                    .content_login_forgetPass {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        @include fonts(14px, 20px, rgba(0, 0, 0, 0.75));
                        margin: 15px 0 0px;
                        width: 100%;
                        overflow: hidden;

                        span {
                            font-size: 14px;
                            margin: 0;
                            cursor: pointer;
                            color: #003CFF;
                        }

                        span:first-child {
                            float: left;
                        }

                        span:last-child {
                            float: right;
                        }

                        .el-button--text {
                            color: $themeColor;
                        }
                    }

                    span {
                        display: block;
                        @include fonts(14px, 22px, $fontColorBlack01);
                        text-align: left;
                        margin-bottom: 8px;
                    }

                    .content_login_loginbtn {
                        font-size: 16px;
                        @include wh(100%, 40px);
                        background-color: $themeColor;
                        border-color: $themeColor;
                        color: $themeBgColor;
                    }

                    .code-input {
                        width: 60%;
                    }

                    .code-img {
                        width: 30%;
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        height: 32px;
                        border-radius: 4px;
                        border: 1px solid #E8E8E8;
                    }

                    .btn {
                        margin-top: 20px;
                    }
                }

                /deep/ .el-form {
                    .el-form-item {
                        margin-bottom: 30px;

                        &:last-of-type {
                            margin-bottom: 0;
                        }
                    }

                    .el-input {
                        border: 1px solid #E8E8EA;
                        border-radius: 4px;
                        padding: 3px 0;

                        .el-input-group__prepend {
                            width: 90px;
                            padding: 0;
                            border: none;
                            background-color: transparent;

                            i {
                                font-size: 22px;
                                color: #3C465D;
                                opacity: 0.2;
                                vertical-align: top;
                                margin-right: 5px;
                            }

                            span {
                                font-size: 16px;
                                color: #3C465D;
                                opacity: 0.5;
                                margin-bottom: 0;
                                display: inline-block;
                            }
                        }

                        input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
                            -webkit-text-fill-color: #000 !important;
                            background-color: transparent;
                            background-image: none;
                            transition: background-color 50000s linear 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
                        }

                        input {
                            outline: none;
                            border: none;
                            background-color: transparent;
                        }

                    }
                }
            }
        }

        .copyright {
            position: absolute;
            bottom: 38px;
            @include wh(100%, 20px);
            text-align: center;
            @include fonts(12px, 20px, $fontColorBlack04);
        }
    }
</style>
<style lang="scss">
    .forget-password {
        width: 310px !important;
    }
</style>
