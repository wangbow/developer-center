import React, {Component} from 'react';
import {Tile, Switch, Col, Form, Button} from 'tinper-bee';
import ReactEcharts from 'echarts-for-react';
import {GetListenRange, GetListenCurrent, getK8sMonitor} from 'serves/appTile';
import {lintAppListData, spiliCurrentTime} from 'components/util';

import { err, warning, success } from 'components/message-util';

/**
 *
 * [{"doc_count":310,"group":{"buckets":[{"doc_count":4,"key":1514278600000,"key_as_string":"2017-12-26T08:56:40.000Z","mem":{"value":652914688.0}},{"doc_count":4,"key":1514278784000,"key_as_string":"2017-12-26T08:59:44.000Z","mem":{"value":654202880.0}},{"doc_count":4,"key":1514278968000,"key_as_string":"2017-12-26T09:02:48.000Z","mem":{"value":653713408.0}},{"doc_count":4,"key":1514279152000,"key_as_string":"2017-12-26T09:05:52.000Z","mem":{"value":653393920.0}},{"doc_count":4,"key":1514279336000,"key_as_string":"2017-12-26T09:08:56.000Z","mem":{"value":654538752.0}},{"doc_count":6,"key":1514279520000,"key_as_string":"2017-12-26T09:12:00.000Z","mem":{"value":687457621.3333334}},{"doc_count":4,"key":1514279704000,"key_as_string":"2017-12-26T09:15:04.000Z","mem":{"value":691290112.0}},{"doc_count":4,"key":1514279888000,"key_as_string":"2017-12-26T09:18:08.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514280072000,"key_as_string":"2017-12-26T09:21:12.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514280256000,"key_as_string":"2017-12-26T09:24:16.000Z","mem":{"value":691294208.0}},{"doc_count":6,"key":1514280440000,"key_as_string":"2017-12-26T09:27:20.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514280624000,"key_as_string":"2017-12-26T09:30:24.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514280808000,"key_as_string":"2017-12-26T09:33:28.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514280992000,"key_as_string":"2017-12-26T09:36:32.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514281176000,"key_as_string":"2017-12-26T09:39:36.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514281360000,"key_as_string":"2017-12-26T09:42:40.000Z","mem":{"value":691294208.0}},{"doc_count":6,"key":1514281544000,"key_as_string":"2017-12-26T09:45:44.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514281728000,"key_as_string":"2017-12-26T09:48:48.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514281912000,"key_as_string":"2017-12-26T09:51:52.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514282096000,"key_as_string":"2017-12-26T09:54:56.000Z","mem":{"value":691294208.0}},{"doc_count":6,"key":1514282280000,"key_as_string":"2017-12-26T09:58:00.000Z","mem":{"value":691294208.0}},{"doc_count":4,"key":1514282464000,"key_as_string":"2017-12-26T10:01:04.000Z","mem":{"value":691298304.0}},{"doc_count":4,"key":1514282648000,"key_as_string":"2017-12-26T10:04:08.000Z","mem":{"value":691298304.0}},{"doc_count":4,"key":1514282832000,"key_as_string":"2017-12-26T10:07:12.000Z","mem":{"value":691298304.0}},{"doc_count":6,"key":1514283016000,"key_as_string":"2017-12-26T10:10:16.000Z","mem":{"value":691298304.0}},{"doc_count":4,"key":1514283200000,"key_as_string":"2017-12-26T10:13:20.000Z","mem":{"value":691298304.0}},{"doc_count":4,"key":1514283384000,"key_as_string":"2017-12-26T10:16:24.000Z","mem":{"value":691298304.0}},{"doc_count":6,"key":1514283568000,"key_as_string":"2017-12-26T10:19:28.000Z","mem":{"value":691298304.0}},{"doc_count":4,"key":1514283752000,"key_as_string":"2017-12-26T10:22:32.000Z","mem":{"value":691355648.0}},{"doc_count":4,"key":1514283936000,"key_as_string":"2017-12-26T10:25:36.000Z","mem":{"value":691355648.0}},{"doc_count":2,"key":1514284120000,"key_as_string":"2017-12-26T10:28:40.000Z","mem":{"value":691355648.0}},{"doc_count":4,"key":1514284304000,"key_as_string":"2017-12-26T10:31:44.000Z","mem":{"value":691355648.0}},{"doc_count":4,"key":1514284488000,"key_as_string":"2017-12-26T10:34:48.000Z","mem":{"value":691355648.0}},{"doc_count":6,"key":1514284672000,"key_as_string":"2017-12-26T10:37:52.000Z","mem":{"value":691355648.0}},{"doc_count":6,"key":1514284856000,"key_as_string":"2017-12-26T10:40:56.000Z","mem":{"value":691355648.0}},{"doc_count":8,"key":1514285040000,"key_as_string":"2017-12-26T10:44:00.000Z","mem":{"value":691355648.0}},{"doc_count":6,"key":1514285224000,"key_as_string":"2017-12-26T10:47:04.000Z","mem":{"value":691355648.0}},{"doc_count":6,"key":1514285408000,"key_as_string":"2017-12-26T10:50:08.000Z","mem":{"value":691355648.0}},{"doc_count":6,"key":1514285592000,"key_as_string":"2017-12-26T10:53:12.000Z","mem":{"value":691355648.0}},{"doc_count":6,"key":1514285776000,"key_as_string":"2017-12-26T10:56:16.000Z","mem":{"value":691355648.0}},{"doc_count":6,"key":1514285960000,"key_as_string":"2017-12-26T10:59:20.000Z","mem":{"value":691355648.0}},{"doc_count":6,"key":1514286144000,"key_as_string":"2017-12-26T11:02:24.000Z","mem":{"value":691355648.0}},{"doc_count":6,"key":1514286328000,"key_as_string":"2017-12-26T11:05:28.000Z","mem":{"value":691380224.0}},{"doc_count":6,"key":1514286512000,"key_as_string":"2017-12-26T11:08:32.000Z","mem":{"value":691380224.0}},{"doc_count":6,"key":1514286696000,"key_as_string":"2017-12-26T11:11:36.000Z","mem":{"value":691380224.0}},{"doc_count":6,"key":1514286880000,"key_as_string":"2017-12-26T11:14:40.000Z","mem":{"value":691380224.0}},{"doc_count":6,"key":1514287064000,"key_as_string":"2017-12-26T11:17:44.000Z","mem":{"value":691380224.0}},{"doc_count":6,"key":1514287248000,"key_as_string":"2017-12-26T11:20:48.000Z","mem":{"value":691380224.0}},{"doc_count":6,"key":1514287432000,"key_as_string":"2017-12-26T11:23:52.000Z","mem":{"value":691380224.0}},{"doc_count":6,"key":1514287616000,"key_as_string":"2017-12-26T11:26:56.000Z","mem":{"value":691388416.0}},{"doc_count":8,"key":1514287800000,"key_as_string":"2017-12-26T11:30:00.000Z","mem":{"value":691388416.0}},{"doc_count":6,"key":1514287984000,"key_as_string":"2017-12-26T11:33:04.000Z","mem":{"value":691388416.0}},{"doc_count":6,"key":1514288168000,"key_as_string":"2017-12-26T11:36:08.000Z","mem":{"value":691388416.0}},{"doc_count":6,"key":1514288352000,"key_as_string":"2017-12-26T11:39:12.000Z","mem":{"value":691388416.0}},{"doc_count":6,"key":1514288536000,"key_as_string":"2017-12-26T11:42:16.000Z","mem":{"value":691388416.0}},{"doc_count":6,"key":1514288720000,"key_as_string":"2017-12-26T11:45:20.000Z","mem":{"value":691388416.0}},{"doc_count":6,"key":1514288904000,"key_as_string":"2017-12-26T11:48:24.000Z","mem":{"value":691388416.0}},{"doc_count":6,"key":1514289088000,"key_as_string":"2017-12-26T11:51:28.000Z","mem":{"value":691388416.0}},{"doc_count":6,"key":1514289272000,"key_as_string":"2017-12-26T11:54:32.000Z","mem":{"value":691388416.0}},{"doc_count":6,"key":1514289456000,"key_as_string":"2017-12-26T11:57:36.000Z","mem":{"value":691388416.0}},{"doc_count":2,"key":1514289640000,"key_as_string":"2017-12-26T12:00:40.000Z","mem":{"value":691388416.0}}]},"key":"t3e60yvt-79d69db7d7-rsrlr"}]
 [{"doc_count":310,"group":{"buckets":[{"cpu":{"value":20912854098.0},"doc_count":4,"key":1514278600000,"key_as_string":"2017-12-26T08:56:40.000Z"},{"cpu":{"value":21361255477.0},"doc_count":4,"key":1514278784000,"key_as_string":"2017-12-26T08:59:44.000Z"},{"cpu":{"value":21611785276.0},"doc_count":4,"key":1514278968000,"key_as_string":"2017-12-26T09:02:48.000Z"},{"cpu":{"value":21848193754.0},"doc_count":4,"key":1514279152000,"key_as_string":"2017-12-26T09:05:52.000Z"},{"cpu":{"value":22086139524.0},"doc_count":4,"key":1514279336000,"key_as_string":"2017-12-26T09:08:56.000Z"},{"cpu":{"value":22414489435.0},"doc_count":6,"key":1514279520000,"key_as_string":"2017-12-26T09:12:00.000Z"},{"cpu":{"value":22705206053.5},"doc_count":4,"key":1514279704000,"key_as_string":"2017-12-26T09:15:04.000Z"},{"cpu":{"value":22930418644.5},"doc_count":4,"key":1514279888000,"key_as_string":"2017-12-26T09:18:08.000Z"},{"cpu":{"value":23151240081.0},"doc_count":4,"key":1514280072000,"key_as_string":"2017-12-26T09:21:12.000Z"},{"cpu":{"value":23323751389.0},"doc_count":4,"key":1514280256000,"key_as_string":"2017-12-26T09:24:16.000Z"},{"cpu":{"value":23578453352.0},"doc_count":6,"key":1514280440000,"key_as_string":"2017-12-26T09:27:20.000Z"},{"cpu":{"value":23825679638.5},"doc_count":4,"key":1514280624000,"key_as_string":"2017-12-26T09:30:24.000Z"},{"cpu":{"value":24032184814.0},"doc_count":4,"key":1514280808000,"key_as_string":"2017-12-26T09:33:28.000Z"},{"cpu":{"value":24212931335.5},"doc_count":4,"key":1514280992000,"key_as_string":"2017-12-26T09:36:32.000Z"},{"cpu":{"value":24451344385.0},"doc_count":4,"key":1514281176000,"key_as_string":"2017-12-26T09:39:36.000Z"},{"cpu":{"value":24621637946.0},"doc_count":4,"key":1514281360000,"key_as_string":"2017-12-26T09:42:40.000Z"},{"cpu":{"value":24860302660.0},"doc_count":6,"key":1514281544000,"key_as_string":"2017-12-26T09:45:44.000Z"},{"cpu":{"value":25080511384.5},"doc_count":4,"key":1514281728000,"key_as_string":"2017-12-26T09:48:48.000Z"},{"cpu":{"value":25248614539.5},"doc_count":4,"key":1514281912000,"key_as_string":"2017-12-26T09:51:52.000Z"},{"cpu":{"value":25457954205.0},"doc_count":4,"key":1514282096000,"key_as_string":"2017-12-26T09:54:56.000Z"},{"cpu":{"value":25722686741.333332},"doc_count":6,"key":1514282280000,"key_as_string":"2017-12-26T09:58:00.000Z"},{"cpu":{"value":25980900953.5},"doc_count":4,"key":1514282464000,"key_as_string":"2017-12-26T10:01:04.000Z"},{"cpu":{"value":26174959799.5},"doc_count":4,"key":1514282648000,"key_as_string":"2017-12-26T10:04:08.000Z"},{"cpu":{"value":26359036358.0},"doc_count":4,"key":1514282832000,"key_as_string":"2017-12-26T10:07:12.000Z"},{"cpu":{"value":26592595597.666668},"doc_count":6,"key":1514283016000,"key_as_string":"2017-12-26T10:10:16.000Z"},{"cpu":{"value":26788802454.5},"doc_count":4,"key":1514283200000,"key_as_string":"2017-12-26T10:13:20.000Z"},{"cpu":{"value":26993605116.5},"doc_count":4,"key":1514283384000,"key_as_string":"2017-12-26T10:16:24.000Z"},{"cpu":{"value":27207822257.333332},"doc_count":6,"key":1514283568000,"key_as_string":"2017-12-26T10:19:28.000Z"},{"cpu":{"value":27469502030.0},"doc_count":4,"key":1514283752000,"key_as_string":"2017-12-26T10:22:32.000Z"},{"cpu":{"value":27708289431.5},"doc_count":4,"key":1514283936000,"key_as_string":"2017-12-26T10:25:36.000Z"},{"cpu":{"value":27846770899.0},"doc_count":2,"key":1514284120000,"key_as_string":"2017-12-26T10:28:40.000Z"},{"cpu":{"value":28012643457.0},"doc_count":4,"key":1514284304000,"key_as_string":"2017-12-26T10:31:44.000Z"},{"cpu":{"value":28205681819.0},"doc_count":4,"key":1514284488000,"key_as_string":"2017-12-26T10:34:48.000Z"},{"cpu":{"value":28436591025.333332},"doc_count":6,"key":1514284672000,"key_as_string":"2017-12-26T10:37:52.000Z"},{"cpu":{"value":28622025583.666668},"doc_count":6,"key":1514284856000,"key_as_string":"2017-12-26T10:40:56.000Z"},{"cpu":{"value":28851836581.0},"doc_count":8,"key":1514285040000,"key_as_string":"2017-12-26T10:44:00.000Z"},{"cpu":{"value":29064828675.666668},"doc_count":6,"key":1514285224000,"key_as_string":"2017-12-26T10:47:04.000Z"},{"cpu":{"value":29258271247.333332},"doc_count":6,"key":1514285408000,"key_as_string":"2017-12-26T10:50:08.000Z"},{"cpu":{"value":29449469050.333332},"doc_count":6,"key":1514285592000,"key_as_string":"2017-12-26T10:53:12.000Z"},{"cpu":{"value":29638833744.0},"doc_count":6,"key":1514285776000,"key_as_string":"2017-12-26T10:56:16.000Z"},{"cpu":{"value":29830229730.0},"doc_count":6,"key":1514285960000,"key_as_string":"2017-12-26T10:59:20.000Z"},{"cpu":{"value":30022882872.0},"doc_count":6,"key":1514286144000,"key_as_string":"2017-12-26T11:02:24.000Z"},{"cpu":{"value":30229712772.333332},"doc_count":6,"key":1514286328000,"key_as_string":"2017-12-26T11:05:28.000Z"},{"cpu":{"value":30427272830.666668},"doc_count":6,"key":1514286512000,"key_as_string":"2017-12-26T11:08:32.000Z"},{"cpu":{"value":30610497629.333332},"doc_count":6,"key":1514286696000,"key_as_string":"2017-12-26T11:11:36.000Z"},{"cpu":{"value":30793737053.0},"doc_count":6,"key":1514286880000,"key_as_string":"2017-12-26T11:14:40.000Z"},{"cpu":{"value":30989863996.333332},"doc_count":6,"key":1514287064000,"key_as_string":"2017-12-26T11:17:44.000Z"},{"cpu":{"value":31178826871.333332},"doc_count":6,"key":1514287248000,"key_as_string":"2017-12-26T11:20:48.000Z"},{"cpu":{"value":31380538619.333332},"doc_count":6,"key":1514287432000,"key_as_string":"2017-12-26T11:23:52.000Z"},{"cpu":{"value":31583870937.0},"doc_count":6,"key":1514287616000,"key_as_string":"2017-12-26T11:26:56.000Z"},{"cpu":{"value":31798192900.25},"doc_count":8,"key":1514287800000,"key_as_string":"2017-12-26T11:30:00.000Z"},{"cpu":{"value":32020149226.666668},"doc_count":6,"key":1514287984000,"key_as_string":"2017-12-26T11:33:04.000Z"},{"cpu":{"value":32209453405.666668},"doc_count":6,"key":1514288168000,"key_as_string":"2017-12-26T11:36:08.000Z"},{"cpu":{"value":32399299384.666668},"doc_count":6,"key":1514288352000,"key_as_string":"2017-12-26T11:39:12.000Z"},{"cpu":{"value":32589228663.333332},"doc_count":6,"key":1514288536000,"key_as_string":"2017-12-26T11:42:16.000Z"},{"cpu":{"value":32786499080.0},"doc_count":6,"key":1514288720000,"key_as_string":"2017-12-26T11:45:20.000Z"},{"cpu":{"value":32972234498.333332},"doc_count":6,"key":1514288904000,"key_as_string":"2017-12-26T11:48:24.000Z"},{"cpu":{"value":33174010298.0},"doc_count":6,"key":1514289088000,"key_as_string":"2017-12-26T11:51:28.000Z"},{"cpu":{"value":33372731330.0},"doc_count":6,"key":1514289272000,"key_as_string":"2017-12-26T11:54:32.000Z"},{"cpu":{"value":33550590162.666668},"doc_count":6,"key":1514289456000,"key_as_string":"2017-12-26T11:57:36.000Z"},{"cpu":{"value":33672176091.0},"doc_count":2,"key":1514289640000,"key_as_string":"2017-12-26T12:00:40.000Z"}]},"key":"t3e60yvt-79d69db7d7-rsrlr"}]
 [{"doc_count":155,"group":{"buckets":[{"doc_count":2,"key":1514278600000,"key_as_string":"2017-12-26T08:56:40.000Z","net_rx":{"value":1381.0},"net_tx":{"value":1814.0}},{"doc_count":2,"key":1514278784000,"key_as_string":"2017-12-26T08:59:44.000Z","net_rx":{"value":6026.0},"net_tx":{"value":5310.0}},{"doc_count":2,"key":1514278968000,"key_as_string":"2017-12-26T09:02:48.000Z","net_rx":{"value":10650.0},"net_tx":{"value":8651.0}},{"doc_count":2,"key":1514279152000,"key_as_string":"2017-12-26T09:05:52.000Z","net_rx":{"value":15818.0},"net_tx":{"value":12501.0}},{"doc_count":2,"key":1514279336000,"key_as_string":"2017-12-26T09:08:56.000Z","net_rx":{"value":20850.0},"net_tx":{"value":16180.0}},{"doc_count":3,"key":1514279520000,"key_as_string":"2017-12-26T09:12:00.000Z","net_rx":{"value":26879.333333333332},"net_tx":{"value":20519.333333333332}},{"doc_count":2,"key":1514279704000,"key_as_string":"2017-12-26T09:15:04.000Z","net_rx":{"value":33090.0},"net_tx":{"value":24992.0}},{"doc_count":2,"key":1514279888000,"key_as_string":"2017-12-26T09:18:08.000Z","net_rx":{"value":37170.0},"net_tx":{"value":27983.0}},{"doc_count":2,"key":1514280072000,"key_as_string":"2017-12-26T09:21:12.000Z","net_rx":{"value":42202.0},"net_tx":{"value":31596.0}},{"doc_count":2,"key":1514280256000,"key_as_string":"2017-12-26T09:24:16.000Z","net_rx":{"value":46146.0},"net_tx":{"value":34519.0}},{"doc_count":3,"key":1514280440000,"key_as_string":"2017-12-26T09:27:20.000Z","net_rx":{"value":51994.0},"net_tx":{"value":38730.0}},{"doc_count":2,"key":1514280624000,"key_as_string":"2017-12-26T09:30:24.000Z","net_rx":{"value":57570.0},"net_tx":{"value":42777.0}},{"doc_count":2,"key":1514280808000,"key_as_string":"2017-12-26T09:33:28.000Z","net_rx":{"value":62466.0},"net_tx":{"value":46320.0}},{"doc_count":2,"key":1514280992000,"key_as_string":"2017-12-26T09:36:32.000Z","net_rx":{"value":66546.0},"net_tx":{"value":49212.0}},{"doc_count":2,"key":1514281176000,"key_as_string":"2017-12-26T09:39:36.000Z","net_rx":{"value":71442.0},"net_tx":{"value":52755.0}},{"doc_count":2,"key":1514281360000,"key_as_string":"2017-12-26T09:42:40.000Z","net_rx":{"value":75658.0},"net_tx":{"value":55816.0}},{"doc_count":3,"key":1514281544000,"key_as_string":"2017-12-26T09:45:44.000Z","net_rx":{"value":81098.0},"net_tx":{"value":59716.0}},{"doc_count":2,"key":1514281728000,"key_as_string":"2017-12-26T09:48:48.000Z","net_rx":{"value":86266.0},"net_tx":{"value":63487.0}},{"doc_count":2,"key":1514281912000,"key_as_string":"2017-12-26T09:51:52.000Z","net_rx":{"value":90210.0},"net_tx":{"value":66047.0}},{"doc_count":2,"key":1514282096000,"key_as_string":"2017-12-26T09:54:56.000Z","net_rx":{"value":95106.0},"net_tx":{"value":69394.0}},{"doc_count":3,"key":1514282280000,"key_as_string":"2017-12-26T09:58:00.000Z","net_rx":{"value":101316.66666666667},"net_tx":{"value":73712.66666666667}},{"doc_count":2,"key":1514282464000,"key_as_string":"2017-12-26T10:01:04.000Z","net_rx":{"value":106530.0},"net_tx":{"value":77386.0}},{"doc_count":2,"key":1514282648000,"key_as_string":"2017-12-26T10:04:08.000Z","net_rx":{"value":111154.0},"net_tx":{"value":80558.0}},{"doc_count":2,"key":1514282832000,"key_as_string":"2017-12-26T10:07:12.000Z","net_rx":{"value":116186.0},"net_tx":{"value":84138.0}},{"doc_count":3,"key":1514283016000,"key_as_string":"2017-12-26T10:10:16.000Z","net_rx":{"value":122054.66666666667},"net_tx":{"value":88058.66666666667}},{"doc_count":2,"key":1514283200000,"key_as_string":"2017-12-26T10:13:20.000Z","net_rx":{"value":126757.0},"net_tx":{"value":91292.0}},{"doc_count":2,"key":1514283384000,"key_as_string":"2017-12-26T10:16:24.000Z","net_rx":{"value":132094.0},"net_tx":{"value":94940.0}},{"doc_count":3,"key":1514283568000,"key_as_string":"2017-12-26T10:19:28.000Z","net_rx":{"value":136808.66666666666},"net_tx":{"value":98246.66666666667}},{"doc_count":2,"key":1514283752000,"key_as_string":"2017-12-26T10:22:32.000Z","net_rx":{"value":142702.0},"net_tx":{"value":102446.0}},{"doc_count":2,"key":1514283936000,"key_as_string":"2017-12-26T10:25:36.000Z","net_rx":{"value":147326.0},"net_tx":{"value":105684.0}},{"doc_count":1,"key":1514284120000,"key_as_string":"2017-12-26T10:28:40.000Z","net_rx":{"value":151678.0},"net_tx":{"value":108518.0}},{"doc_count":2,"key":1514284304000,"key_as_string":"2017-12-26T10:31:44.000Z","net_rx":{"value":155758.0},"net_tx":{"value":111245.0}},{"doc_count":2,"key":1514284488000,"key_as_string":"2017-12-26T10:34:48.000Z","net_rx":{"value":160654.0},"net_tx":{"value":114623.0}},{"doc_count":3,"key":1514284672000,"key_as_string":"2017-12-26T10:37:52.000Z","net_rx":{"value":166094.0},"net_tx":{"value":118556.0}},{"doc_count":3,"key":1514284856000,"key_as_string":"2017-12-26T10:40:56.000Z","net_rx":{"value":170990.0},"net_tx":{"value":122044.0}},{"doc_count":4,"key":1514285040000,"key_as_string":"2017-12-26T10:44:00.000Z","net_rx":{"value":176770.0},"net_tx":{"value":125937.5}},{"doc_count":3,"key":1514285224000,"key_as_string":"2017-12-26T10:47:04.000Z","net_rx":{"value":182323.33333333334},"net_tx":{"value":129725.33333333333}},{"doc_count":3,"key":1514285408000,"key_as_string":"2017-12-26T10:50:08.000Z","net_rx":{"value":187310.0},"net_tx":{"value":133284.66666666666}},{"doc_count":3,"key":1514285592000,"key_as_string":"2017-12-26T10:53:12.000Z","net_rx":{"value":192115.33333333334},"net_tx":{"value":136639.33333333334}},{"doc_count":3,"key":1514285776000,"key_as_string":"2017-12-26T10:56:16.000Z","net_rx":{"value":197192.66666666666},"net_tx":{"value":140088.66666666666}},{"doc_count":3,"key":1514285960000,"key_as_string":"2017-12-26T10:59:20.000Z","net_rx":{"value":201998.0},"net_tx":{"value":143508.0}},{"doc_count":3,"key":1514286144000,"key_as_string":"2017-12-26T11:02:24.000Z","net_rx":{"value":207075.33333333334},"net_tx":{"value":147133.33333333334}},{"doc_count":3,"key":1514286328000,"key_as_string":"2017-12-26T11:05:28.000Z","net_rx":{"value":212084.0},"net_tx":{"value":150620.0}},{"doc_count":3,"key":1514286512000,"key_as_string":"2017-12-26T11:08:32.000Z","net_rx":{"value":216752.0},"net_tx":{"value":153894.0}},{"doc_count":3,"key":1514286696000,"key_as_string":"2017-12-26T11:11:36.000Z","net_rx":{"value":221829.33333333334},"net_tx":{"value":157189.33333333334}},{"doc_count":3,"key":1514286880000,"key_as_string":"2017-12-26T11:14:40.000Z","net_rx":{"value":226816.0},"net_tx":{"value":160570.0}},{"doc_count":3,"key":1514287064000,"key_as_string":"2017-12-26T11:17:44.000Z","net_rx":{"value":231621.33333333334},"net_tx":{"value":164011.33333333334}},{"doc_count":3,"key":1514287248000,"key_as_string":"2017-12-26T11:20:48.000Z","net_rx":{"value":236336.0},"net_tx":{"value":167296.0}},{"doc_count":3,"key":1514287432000,"key_as_string":"2017-12-26T11:23:52.000Z","net_rx":{"value":241141.33333333334},"net_tx":{"value":170429.33333333334}},{"doc_count":3,"key":1514287616000,"key_as_string":"2017-12-26T11:26:56.000Z","net_rx":{"value":246037.33333333334},"net_tx":{"value":173587.33333333334}},{"doc_count":4,"key":1514287800000,"key_as_string":"2017-12-26T11:30:00.000Z","net_rx":{"value":251908.0},"net_tx":{"value":177489.0}},{"doc_count":3,"key":1514287984000,"key_as_string":"2017-12-26T11:33:04.000Z","net_rx":{"value":257824.0},"net_tx":{"value":181568.0}},{"doc_count":3,"key":1514288168000,"key_as_string":"2017-12-26T11:36:08.000Z","net_rx":{"value":262357.3333333333},"net_tx":{"value":184671.33333333334}},{"doc_count":3,"key":1514288352000,"key_as_string":"2017-12-26T11:39:12.000Z","net_rx":{"value":267344.0},"net_tx":{"value":187788.0}},{"doc_count":3,"key":1514288536000,"key_as_string":"2017-12-26T11:42:16.000Z","net_rx":{"value":272421.3333333333},"net_tx":{"value":190973.33333333334}},{"doc_count":3,"key":1514288720000,"key_as_string":"2017-12-26T11:45:20.000Z","net_rx":{"value":277136.0},"net_tx":{"value":194192.0}},{"doc_count":3,"key":1514288904000,"key_as_string":"2017-12-26T11:48:24.000Z","net_rx":{"value":282213.3333333333},"net_tx":{"value":197289.33333333334}},{"doc_count":3,"key":1514289088000,"key_as_string":"2017-12-26T11:51:28.000Z","net_rx":{"value":287109.3333333333},"net_tx":{"value":200494.0}},{"doc_count":3,"key":1514289272000,"key_as_string":"2017-12-26T11:54:32.000Z","net_rx":{"value":292005.3333333333},"net_tx":{"value":203587.33333333334}},{"doc_count":3,"key":1514289456000,"key_as_string":"2017-12-26T11:57:36.000Z","net_rx":{"value":296720.0},"net_tx":{"value":206476.0}},{"doc_count":1,"key":1514289640000,"key_as_string":"2017-12-26T12:00:40.000Z","net_rx":{"value":300256.0},"net_tx":{"value":208450.0}}]},"key":"t3e60yvt-79d69db7d7-rsrlr"}]

 */
class ListenceEchart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cupList: [],
      memList: [],
      memxAxisList: [],
      cpuxAxisList: [],
      activeContainer: true,
    }

  }

  componentDidMount() {
    this.getListensData();
  }

  componentWillReceiveProps() {
    this.setState({
      activeContainer: this.state.activeContainer
    });
    //this.getListensData();
  }

  recursiveGetPre = (i, data, key, key2) => {
    if (!key2) {
      key2 = 'value';
    }
    let curIndex = i - 1;
    if (curIndex < 0) return null;
    if (data[curIndex][key][key2]) {
      return data[curIndex];
    } else {
      this.recursiveGetPre(curIndex, data, key, key2);
    }

  }

  calDvalue = (prev, cur, time, key, key2) => {
    let calValue;
    let aveTemp;
    if (!cur) return null;
    if (!prev) {
      return null;
    }
    if (cur < prev) {
      calValue = prev - cur;
    } else {
      calValue = cur - prev;
    }
    aveTemp = calValue / time;
    //aveTemp = aveTemp.toFixed(2);
    return aveTemp;
  }

  calTime = (data) => {
    let xAxisObj = spiliCurrentTime(data.key_as_string);
    if (xAxisObj.minute < 10) {
      xAxisObj.minute = "0" + xAxisObj.minute;
    }
    if (xAxisObj.second < 10) {
      xAxisObj.second = "0" + xAxisObj.second;
    }
    let timeStamp = xAxisObj.hour + ":" + xAxisObj.minute + ":" + xAxisObj.second;
    return timeStamp;
  }

  getListensData = (duration = 24) => {
    let param;
    if (!this.state.activeContainer) {
      duration = 24;
    }
    param = {
      app_id: this.props.id,
      duration: duration
    };
    console.log(this.props.type);
    if(this.props.type === 3){
      this.getK8sMonitors(param);
    }else{
      this.getMesosMonitor(param);
    }





    // GetListenCurrent(param,function(response) {
    // 	let res = lintAppListData(response,null,null);
    // 	if(!res || res.error_code) return;
    // 	console.log(res);
    // })
  }

  getK8sMonitors = (data) => {
    console.log(11);
    let memList;
    let cpuList;
    let nettxList;
    let netrxList;
    let instaneceCpuList = [];
    let instaneceMemList = [];
    let instaneceNetxList = [];
    let instaneceNerxList = [];
    let instanceNames = [];
    let listenDataList = [];
    let memTemp;
    let xAxisList;

    let param = `app_id=${data.app_id}&duration=${data.duration}`;
    getK8sMonitor('cpu', param).then((res) => {
      let data = res.data;
      if(data.error_code){
        return err(`${data.error_code}:${data.error_message}`)
      }
      let dataCpu = data[0].group.buckets;
      dataCpu.forEach((item) => {

      })

    })
    getK8sMonitor('memory', param).then((res) => {
      let data = res.data;
      if(data.error_code){
        return err(`${data.error_code}:${data.error_message}`)
      }

      let dataMem = data[0].group.buckets;

      dataMem.forEach((item) => {
        let memTemp = Math.round(item.mem.value / (1024 * 1024) * 100) / 100;
        memList.push(memTemp);
        let timeStamp = this.calTime(item);
        xAxisList.push(timeStamp);
      })

    })
    getK8sMonitor('network', param).then((res) => {
      let data = res.data;
      if(data.error_code){
        return err(`${data.error_code}:${data.error_message}`)
      }
      let dataNet = data[0].group.buckets;

      dataNet.forEach((item, index, array) => {
        if(index !== 0){

        }
        let netrxTemp = this.calDvalue(array[index - 1], item.net_rx.value, intervalInSec);
      })
    })
  }

  getMesosMonitor = (param) => {
    GetListenRange(param, response => {

      let res = lintAppListData(response, null, null);

      if (!res || res.error_code || !res.data || !res.data.length) return;
      //let res = response.data;
      let instanceLen = res.data;

      let memList;
      //let xAxisList;
      let cpuList;
      let nettxList;
      let netrxList;
      let instaneceCpuList = [];
      let instaneceMemList = [];
      let instaneceNetxList = [];
      let instaneceNerxList = [];
      let instanceNames = [];
      let listenDataList = [];
      let memTemp;

      let max = res.data[0].group.buckets.length;
      let maxIndex = 0;
      for (let instanceIndex = 0; instanceIndex < res.data.length; instanceIndex++) {
        let listenDataList = res.data[instanceIndex].group.buckets;
        //判断哪个长度最长
        // for(let i =0;i<listenDataList.length;i++) {
        // 	if(listenDataList[i].mem.value === null) {
        // 		listenDataList.splice(i,1);
        // 		i--;
        // 		continue;
        // 	}
        // }
        if (max < listenDataList.length) {
          max = listenDataList.length;
          maxIndex = instanceIndex;
        }
      }

      let longestListenDataList = res.data[maxIndex].group.buckets;
      let xAxisList = [];
      //根据最长的计算横轴列表
      for (let i = 0; i < longestListenDataList.length; i++) {
        let timeStamp = this.calTime(longestListenDataList[i]);
        xAxisList.push(timeStamp);
      }

      for (let instanceIndex = 0; instanceIndex < res.data.length; instanceIndex++) {
        let listenDataList = res.data[instanceIndex].group.buckets;

        memList = [];
        cpuList = [];
        nettxList = [];
        netrxList = [];

        for (let i = 0; i < listenDataList.length; i++) {
          // if(listenDataList[i].mem.value === null || listenDataList[i].cpu_stats.avg === null || listenDataList[i].net_rx.value === null || listenDataList[i].net_tx.value === null) {
          // 	listenDataList.splice(i,1);
          // 	i--;
          // 	continue;
          // }

          //xAxisList = ["01:00:00","02:20:00","06:04:00","08:04:00","12:33:00","16:44:09","18:44:09","22:44:09",,"23:44:09"];
          if (i > 0) {
            let cur = listenDataList[i];
            let prev = listenDataList[i - 1];
            let calCpu;

            if (!listenDataList[i].mem.value) {
              memTemp = null;
            } else {
              memTemp = listenDataList[i].mem.value / (1024 * 1024);
              memTemp = Math.round(memTemp * 100) / 100
            }

            let timeStamp = this.calTime(longestListenDataList[i]);
            memList.push(memTemp);

            let intervalNs = this.getInterval(cur.key_as_string, prev.key_as_string);

            prev = this.recursiveGetPre(i, listenDataList, "cpu_stats", "avg");

            let cpuTemp = this.calDvalue(prev && prev.cpu_stats.avg, cur.cpu_stats.avg, intervalNs) * 100;
            cpuTemp = Math.round(cpuTemp * 100) / 100;
            cpuList.push(cpuTemp);

            let intervalNet;
            let calNet_tx;
            let calNet_rx;
            let intervalInSec = intervalNs / 1000000000;

            prev = this.recursiveGetPre(i, listenDataList, "net_rx");
            let netrxTemp = this.calDvalue(prev && prev.net_rx.value, cur.net_rx.value, intervalInSec);

            prev = this.recursiveGetPre(i, listenDataList, "net_tx");
            let nettxTemp = this.calDvalue(prev && prev.net_tx.value, cur.net_tx.value, intervalInSec);

            netrxList.push(Math.round(netrxTemp * 100) / 100);
            nettxList.push(Math.round(nettxTemp * 100) / 100);

          }
        }
        //补充数据
        let tempCpuLen = xAxisList.length - cpuList.length;
        if (tempCpuLen > 0) {
          for (let t = 0; t < tempCpuLen - 1; t++) {
            cpuList.unshift(null);
          }
        }
        //补充数据
        let tempMenLen = xAxisList.length - memList.length;
        if (tempMenLen > 0) {
          for (let t = 0; t < tempMenLen - 1; t++) {
            memList.unshift(null);
          }
        }

        //补充数据
        let tempTxLen = xAxisList.length - nettxList.length;
        if (tempTxLen > 0) {
          for (let t = 0; t < tempTxLen - 1; t++) {
            nettxList.unshift(null);
          }
        }
        //补充数据
        let tempRxLen = xAxisList.length - netrxList.length;
        if (tempRxLen > 0) {
          for (let r = 0; r < tempRxLen - 1; r++) {
            netrxList.unshift(null);
          }

        }

        let contaner_name = res.containers[res.data[instanceIndex].key];

        let instanceName = '';

        if (typeof contaner_name === 'string') {
          let arrayText = contaner_name.split(".")[1].split("-");
          instanceName = arrayText[0] + "-" + arrayText[1] + "-" + arrayText[2];
        }


        instaneceCpuList.push({
          name: `CPU-${instanceName}`,
          type: 'line',
          smooth: true,
          data: cpuList,
        })
        instaneceMemList.push({
          name: `内存-${instanceName}`,
          type: 'line',
          smooth: true,
          data: memList
        })
        instaneceNetxList.push({
          name: `Net tx-${instanceName}`,
          type: 'line',
          smooth: true,
          data: nettxList
        })
        instaneceNerxList.push({
          name: `Net rx-${instanceName}`,
          type: 'line',
          smooth: true,
          data: netrxList
        })
        instanceNames.push(res.data[instanceIndex].key);
      }
      if (!xAxisList || !xAxisList.length) return;
      let xAxisListCopy = xAxisList;
      xAxisListCopy.splice(0, 1);
      this.setState({
        memList: memList,
        memxAxisList: xAxisList,
        cpuxAxisList: xAxisList,
        cpuList: cpuList,
        netrxList: netrxList,
        nettxList: nettxList,
        instaneceNerxList: instaneceNerxList,
        instaneceNetxList: instaneceNetxList,
        instaneceMemList: instaneceMemList,
        instaneceCpuList: instaneceCpuList,
        instanceNames: instanceNames,
      });

    })
  }

  getInterval = (current, previous) => {
    let cur = new Date(current);
    let prev = new Date(previous);
    return (cur.getTime() - prev.getTime()) * 1000000;
  }

  triggerGetListenData = (duration) => () => {

    if (!duration && this.state.activeContainer) {
      return;
    }
    if (duration && !this.state.activeContainer) {
      return;
    }
    //if(duration) {
    this.setState({
      activeContainer: !this.state.activeContainer
    });
    //}
    this.getListensData(duration);

  }

  getCPUOption = () => {
    return {
      title: {
        text: 'CPU'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.state.instanceNames
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.state.cpuxAxisList,
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 10

      },
      series: this.state.instaneceCpuList

    };
  }

  getMemoryOption = () => {
    return  {
      title: {
        text: '内存(MB)'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.state.instanceNames
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.state.memxAxisList
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.instaneceMemList

    };
  }

  getNetRxOption = () => {
    return {
      title: {
        text: '网络流入(Byte)'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        legend: {
          left: 'left',
          data: ['Net tx']
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.state.cpuxAxisList
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.instaneceNerxList

    };

  }
  getNetTxOption = () => {
    return {
      title: {
        text: '网络流出(Byte)'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        legend: {
          left: 'left',
          data: this.state.instanceNames
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.state.cpuxAxisList
      },
      yAxis: {
        type: 'value'
      },
      series: this.state.instaneceNetxList

    };

  }

  render() {
    // 基于准备好的dom，初始化echarts实例


    console.log("render");

    return (
      <div className="listence-echart">
        <div>
          <Button shape="border" className={this.state.activeContainer ? 'active' : ''}
                  onClick={this.triggerGetListenData()}>实时</Button>
          <Button shape="border" className={this.state.activeContainer ? '' : 'active'}
                  onClick={this.triggerGetListenData(24)}>24小时</Button>
        </div>
        <ReactEcharts ref='cpu' option={this.getCPUOption()}/>
        <ReactEcharts ref='memory' option={this.getMemoryOption()}/>
        <ReactEcharts ref='net_rx' option={this.getNetRxOption()}/>
        <ReactEcharts ref='net_tx' option={this.getNetTxOption()}/>
      </div>
    )
  }

}


export default ListenceEchart;
