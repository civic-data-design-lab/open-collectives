// morph shapes animation sequence
var morphSvg = anime({
    targets: '#svg-morph',
    translateY: 2 * winHeight,
    translateX: ['-50%', '-50%'],
    easing: 'linear',
    autoplay: false
});
var morphShape1 = anime({
    targets: '#svg-morph #shape1',
    d: [
        {value: 'M159.45,624.48L227.11,450.48L297.76,268.77L592.24,322.92L887.11,582.24L995.69,608.89C990.24,624.59,969.12,681.15,962.89,696.94L897.27,873L454.4,723.84Z', duration: 0},
        {value: 'M532.47,561L785.23,549.1L903.9,543.52L966.32,699.31L1039.32,700.71L1409.92,839.71C1408.10,848.71,1405.02,863.84,1402.92,873.4L986,1025L852.61,954.81Z', delay: 200, duration: 200, endDelay: 200},
        {value: 'M864.78,862.27L1011.59,648.05L1138.59,733.99L1087,809.26L1166.1,769.75L1300,1038.19C1200.61,1107.05,1094.94,1084.72,1049.27,1006.51L1007.16,925.7L991.05,949.21Z', duration: 200}
    ],
    fill: [
        {value: "#FBE9CF", duration: 0}, 
        {value: "#FF6666", delay: 200, duration: 200, endDelay: 200},
        {value: "#FBE9CF", duration: 200}
    ],
    easing: 'easeInOutSine',
    autoplay: false
});
// var morphShape2 = anime({
//     targets: '#svg-morph #shape2',
//     d: [
//         {value: 'M493.61,187L669.56,199.2L680.23,54C712.08,56,880.55,68.16,899.23,69.48C921.23,71.04,1096.23,82.78,1117.08,84.88L1100.51,307.32L895.83,292.32L883.5,460.39L787.84,453.39L758.7,864.57L748.41,1009.7L435.26,986L454.4,723.84L469.62,515.43L485.12,303.21Z'},
//         {value: 'M591.51,215L535.79,118.9L702.66,91.06C749,85.14,797.05,75.24,813.31,72.58C832.63,69.42,900,59.24,918.59,55L1108.91,243.74L1387.45,519.74L1560.11,690.9V731.12L1485.65,784.27L1387.45,787.76L1289.76,698.85L1153,574.39L1223.19,553.39L994.55,223.43Z'},
//         {value: 'M1249.75,0.5H1302.65L1303.84,192.87C1303.84,256.82,1355.4,294.61,1405.91,294.61C1541.82,294.61,1541.82,89.33,1407.60,89.33L1405.81,35.33L1636.89,29.56L1639.73,122.96L1534.32,161.70L1658.08,236.22L1609.62,323.57L1492.79,284.86L1536.43,389.72L1444.94,429.13H1251.72Z'}
//     ],
//     easing: 'easeInOutSine',
//     autoplay: true
// });
var morphShape2a = anime({
    targets: '#svg-morph #shape2a',
    d: [
        {value: 'M787.84,453.36c-54.2,-28,-130.1,-139.34,-122.29,-168.63l4,-85.49l-175.94,-12.24l-58.35,799l313.15,23.7l10.29,-145.13z', duration: 0},
        {value: 'M1356.56,489.29c-1.9,7,-69.62,48.69,-90.83,50.71l-42.52,13.34l-70.19,21l234.43,213.37l172.66,-56.64v-40.17z', delay: 200, duration: 200, endDelay: 200},
        {value: 'M1483.15,261.65c-59.66,65.49,-179.31,22.89,-179.31,-68.78l-1.19,-192.37h-52.9l2,428.59h193.22l91.49,-39.41z', duration: 200}
    ],
    fill: [
        {value: "#F8C5D7", duration: 0}, 
        {value: "#FF6666", delay: 200, duration: 200, endDelay: 200},
        {value: "#F8C5D7", duration: 200}
    ],
    easing: 'easeInOutSine',
    autoplay: false
});
var morphShape2b = anime({
    targets: '#svg-morph #shape2b',
    d: [
        {value: 'M883.5,460.39l12.34,-168.1l204.68,15l16.57,-222.44l-436.86,-30.85l-10.67,145.24c-7.29,34.31,-10.72,83,-9.46,123.16l-10.89,118.89l48.27,7l90.36,5.11z', duration: 0},
        {value: 'M1330.29,628l26.27,-138.69l-210.2,-208.17l-227.77,-226.14l-382.8,63.93l55.72,96.07c86.7,2.25,316.82,7.56,353.62,7.37l49.42,1l87.56,126.33l141.1,203.58z', delay: 200, duration: 200, endDelay: 200},
        {value: 'M1658.08,236.18l-123.76,-74.52l105.41,-38.74l-2.84,-93.4l-231.08,5.77l1.79,54c109.52,0,129.67,136.68,59.53,187l25.66,8.51h0l116.83,38.71z', duration: 200}
    ],
    fill: [
        {value: "#F8C5D7", duration: 0}, 
        {value: "#FF6666", delay: 200, duration: 200, endDelay: 200},
        {value: "#F8C5D7", duration: 200}
    ],
    easing: 'easeInOutSine',
    autoplay: false
});
var morphShape3 = anime({
    targets: '#svg-morph #shape3',
    d: [
        {value: 'M1259.17,291.13L1220.99,176.6L1186.33,72.61L1067.23,112.3L982.5,140.54L879.36,174.91L772.19,210.63L671.05,244.34L563.87,280.06L811.84,1024L1044.71,946.38L1044.82,876.71L1253.78,876.69L1434.3,816.52L1401.38,717.77L1367.22,615.3L1332.17,510.14L1294.78,397.96L1259.17,291.13', duration: 0},
        {value: 'M1006.57,327.83L1001.08,280.2L994.55,223.43L945.13,222.4L878.22,221L813.31,219.65L744.22,218.21L671.15,216.69L591.51,215.03L785.23,549.12L846.19,546.26L903.9,543.54L922.47,589.88L1035.1,575.8L1030.98,540L1025.83,495.23L1019.57,440.87L1013.39,387.1L1006.57,327.83', delay: 200, duration: 200, endDelay: 200},
        {value: 'M597.75,642.55L720.22,642.56L708.65,547.76L489.2,547.73L489.2,676.44L414.62,685.55L160.37,685.89L143.98,547.73L100,547.73L121.1,849.9L305.71,849.9L432.29,834.43L444.55,937.73L597.75,919L597.75,789.88L718.65,789.9L718.65,716.07L597.75,716.07L597.75,642.55', duration: 200}
    ],
    easing: 'easeInOutSine',
    autoplay: false
});
var morphShape4 = anime({
    targets: '#svg-morph #shape4',
    d: [
        {value: 'M1457.28,696.94L935.89,696.94L935.89,490.25L1079.27,296.48L1348.54,258.77L1512.23,258.77L1512.23,528.77L1457.28,696.94', duration: 0},
        {value: 'M785.23,549.12L532.47,561.02L236.36,196.78L246.19,167.3L535.79,118.93L591.51,215.03L698.86,400.16L785.23,549.12', delay: 200, duration: 200, endDelay: 200},
        {value: 'M750.33,382.82L332.18,430.75L332.18,283.02L499.83,54.7L656.76,54.7L881.63,170.75L814.65,278.93L750.33,382.82', duration: 200}
    ],
    easing: 'easeInOutSine',
    autoplay: false
});
var morphShape5 = anime({
    targets: '#svg-morph #shape5',
    d: [
        {value: 'M1570.22,664.68l190.31,109.82l0,65.91c-8.78,5.17,-70.71,41,-84.57,48.85l-190.3,-109.81v-65.92z', duration: 0},
        {value: 'M1560.11,690.9l123.53,49.1l-9.83,35.09c-17.76,7.64,-125.29,48.2,-165.64,63.17l-120.72,-50.54v-38.18z', delay: 200, duration: 200, endDelay: 200},
        {value: 'M1077,612.67l194.23,53.08l-14.09,51.91c-4.19,27.81,-21.49,42.88,-56.8,33.62l-61.75,-17.28l-81.44,-48.55z', duration: 200}
    ],
    fill: [
        {value: "#FDF4C4", duration: 0}, 
        {value: "#FF6666", delay: 200, duration: 200, endDelay: 200},
        {value: "#FBE9CF", duration: 200}
    ],
    easing: 'easeInOutSine',
    autoplay: false
});

$(window).on("scroll", function(e) {
    // console.log("pageYOffset: " + window.pageYOffset);
    // console.log("winHeight: " + winHeight);
    // console.log((window.pageYOffset - winHeight) / (2 * winHeight) * 1000);

    morphSvg.seek((window.pageYOffset - winHeight) / (2 * winHeight) * 1000);
    morphShape1.seek((window.pageYOffset - winHeight) / (2 * winHeight) * 1000);
    morphShape2a.seek((window.pageYOffset - winHeight) / (2 * winHeight) * 1000);
    morphShape2b.seek((window.pageYOffset - winHeight) / (2 * winHeight) * 1000);
    morphShape3.seek((window.pageYOffset - winHeight) / (2 * winHeight) * 1000);
    morphShape4.seek((window.pageYOffset - winHeight) / (2 * winHeight) * 1000);
    morphShape5.seek((window.pageYOffset - winHeight) / (2 * winHeight) * 1000);
});