export default {
    computed: {
        isBoiledWater: function () {
            //是否是开水机
            return function (value) {
                if ((value & 2) == 2 || (value & 4) == 4) {
                    //定量 - 时间 元/秒
                    return true;
                } else {
                    return false;
                }
            };
        },
        isSupportDosage: function () {
            //是否是开水机
            return function (value) {
                if ((value & 2) == 2) {
                    //定量 - 时间 元/秒
                    return false;
                } else {
                    //定量 - 用量 元/秒
                    return true;
                }
            };
        }
    },
};
