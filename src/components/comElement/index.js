import ComBreadcrumb from "./ComBreadcrumb.vue";
import ComTable from "./ComTable.vue";

export default {
    install(Vue) {
        Vue.component('ComBreadcrumb', ComBreadcrumb);
        Vue.component('ComTable', ComTable);
    }
}