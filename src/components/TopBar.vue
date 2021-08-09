<template>
    <div class="com-top-bar">
        <div class="logo">
            <!--<img src="../assets/img/logo.png" alt="">-->
            {{siteName}}
        </div>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                <span class="el-icon-user-solid"></span>
                {{userInfo.name || userInfo.userName || "小明"}}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>密码管理</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>账号登出</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script>
    const rsaConfig = require('@/rsaConfig.js');
    import tokenUtil from "../utils/tokenUtil";
    import {mapActions} from 'vuex';
    import {logoutAPI} from "../request/api";

    export default {
        name: 'TopBar',
        data() {
            return {
                siteName: rsaConfig.siteName,
                userInfo: {}
            }
        },
        methods: {
            // ...mapActions(["getUserInfo"]),
            async onLogout() {
                let token = tokenUtil.getToken();
                if (token === undefined) {
                    console.log("token不存在-用户信息");
                    return
                }
                try {
                    let {data, code, message} = await logoutAPI({
                        token: token
                    });
                    if (Number(code) === 0) {
                        tokenUtil.clearToken();
                        this.$router.push({
                            name: 'Login'
                        });
                    }
                } catch (e) {
                    throw Error(e)
                }
            },
            handleCommand(command) {
                console.log('command', command)
                if (command === 'password') {
                    // this.$store.commit('changePasswordStatus', true);
                    this.changePasswordStatus(true)
                }
                if (command === 'logout') {
                    this.$confirm('请确定是否要退出系统？', '账号登出提醒', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.onLogout();
                    }).catch(() => {
                    });
                }
            }
        },
        created() {
            /*this.getUserInfo(() => {
                this.userInfo = this.$store.state.userInfo;
            })*/
        }
    }
</script>

<style scoped lang="scss">
    .com-top-bar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 0 40px;
        height: $menuHeight;
        line-height: $menuHeight;
        background-color: $themeBgColor;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: $white;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
        z-index: 10;

        .logo {
            font-size: 18px;
            font-weight: bold;

            img {
                width: 40px;
                height: 40px;
                vertical-align: middle;
                margin-right: 5px;
            }
        }

        /deep/ .el-dropdown {
            line-height: 30px;

            .el-dropdown-link {
                color: $white;
                cursor: pointer;

                & > span {
                    font-size: 16px;
                }
            }
        }
    }
</style>