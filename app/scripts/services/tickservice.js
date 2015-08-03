'use strict';

/**
 * @ngdoc service
 * @name atacamaApp.tickService
 * @description
 * # tickService
 * Service in the atacamaApp.
 */
angular.module('atacamaApp')
  .service('tickService', function() {
      // AngularJS will instantiate a singleton by calling "new" on this function
      console.log('tickService has been created');

      var items = [{
          //  {id: 1, label: 'Item 0'},
          //  {id: 2, label: 'Item 1'}

          key: "Cumulative Return",
          values: [

              {"date":1437583864374, "open":100.0, "high":100.24021489109903, "low":98.2724267098159, "close":99.51909089116204, "volume":107.79215866544341, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.377+01:00"},
              {"date":1437583865374, "open":99.51909089116204, "high":99.80085742068052, "low":98.07854430357698, "close":98.96118525259855, "volume":107.05424478764692, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.380+01:00"},
              {"date":1437583866374, "open":98.96118525259855, "high":101.89084995077135, "low":96.19961597650557, "close":101.72186021242123, "volume":105.55411074862542, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.381+01:00"},
              {"date":1437583867374, "open":101.72186021242123, "high":103.97519483761593, "low":100.13243396439134, "close":102.0370391829795, "volume":97.04891526361668, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.383+01:00"},
              {"date":1437583868374, "open":102.0370391829795, "high":102.2589583926082, "low":100.90862270314337, "close":102.25884355658684, "volume":97.64334534845825, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.384+01:00"},
              {"date":1437583869374, "open":102.25884355658684, "high":103.85763160289618, "low":101.05023737449392, "close":102.25642530014936, "volume":93.88105839353287, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.397+01:00"},
              {"date":1437583870374, "open":102.25642530014936, "high":103.06296835844572, "low":100.02265611469811, "close":100.37850713496852, "volume":92.46035687775645, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.399+01:00"},
              {"date":1437583871374, "open":100.37850713496852, "high":100.46082086238115, "low":97.87170708740364, "close":98.24015186027637, "volume":107.9004074264331, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.400+01:00"},
              {"date":1437583872374, "open":98.24015186027637, "high":98.59949901009483, "low":96.25991418710258, "close":96.3903971867347, "volume":92.39443628788982, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.401+01:00"},
              {"date":1437583873374, "open":96.3903971867347, "high":98.78625495292454, "low":96.33175758571929, "close":97.65650338620361, "volume":108.1215211119604, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.401+01:00"},
              {"date":1437583874374, "open":97.65650338620361, "high":98.38231737556474, "low":96.71660587060553, "close":98.34439540574316, "volume":106.44873643943887, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.402+01:00"},
              {"date":1437583875374, "open":98.34439540574316, "high":100.37319438579436, "low":98.22020861689407, "close":99.16645655045913, "volume":90.74056997521049, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.403+01:00"},
              {"date":1437583876374, "open":99.16645655045913, "high":99.67374987029211, "low":99.02436224171439, "close":99.22125782965333, "volume":99.90269063750134, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.404+01:00"},
              {"date":1437583877374, "open":99.22125782965333, "high":100.0409482752524, "low":97.96368791808139, "close":99.13914225195717, "volume":98.32229192156673, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.404+01:00"},
              {"date":1437583878374, "open":99.13914225195717, "high":99.1852051997141, "low":96.25244252591615, "close":99.00954261526864, "volume":94.52740803827534, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.409+01:00"},
              {"date":1437583879374, "open":99.00954261526864, "high":101.07070562390247, "low":98.26964363154062, "close":101.00401455630472, "volume":95.67273704109914, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.410+01:00"},
              {"date":1437583880374, "open":101.00401455630472, "high":102.55936245698267, "low":99.76103862196958, "close":101.96615265369573, "volume":97.86967656258518, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.412+01:00"},
              {"date":1437583881374, "open":101.96615265369573, "high":103.74523629964507, "low":101.34453488362152, "close":102.3974268070314, "volume":93.41342930521394, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.413+01:00"},
              {"date":1437583882374, "open":102.3974268070314, "high":103.2878186381571, "low":102.25322319528027, "close":102.95586600356431, "volume":105.12018852931348, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.414+01:00"},
              {"date":1437583883374, "open":102.95586600356431, "high":103.51292913953083, "low":101.54641836076026, "close":102.58851578347759, "volume":95.27257053856013, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.415+01:00"},
              {"date":1437583884374, "open":102.58851578347759, "high":103.79519037680444, "low":100.35028466288281, "close":100.83395823101, "volume":102.08162605190469, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.416+01:00"},
              {"date":1437583885374, "open":100.83395823101, "high":102.86136502218336, "low":100.15087818352472, "close":101.43576153212476, "volume":90.10890616324076, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.417+01:00"},
              {"date":1437583886374, "open":101.43576153212476, "high":102.93713070220251, "low":99.53166214991123, "close":101.65819865396729, "volume":102.75222036782279, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.418+01:00"},
              {"date":1437583887374, "open":101.65819865396729, "high":102.55780026815219, "low":100.48142456798917, "close":102.5357398017723, "volume":94.68388748606684, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.418+01:00"},
              {"date":1437583888374, "open":102.5357398017723, "high":103.31987237064892, "low":102.44083905714389, "close":102.5321921084003, "volume":100.04041752476795, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.420+01:00"},
              {"date":1437583889374, "open":102.5321921084003, "high":102.67962598466066, "low":100.42117764667188, "close":101.92487518360895, "volume":98.19774570456495, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.421+01:00"},
              {"date":1437583890374, "open":101.92487518360895, "high":104.2981988471695, "low":99.00784921845143, "close":99.92453222343627, "volume":93.126269212895, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.422+01:00"},
              {"date":1437583891374, "open":99.92453222343627, "high":101.65036290469304, "low":99.11514456427712, "close":100.73804588551869, "volume":104.60510957125587, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.423+01:00"},
              {"date":1437583892374, "open":100.73804588551869, "high":101.30178788256745, "low":98.63208844313137, "close":98.772850179082, "volume":99.98518101782699, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.424+01:00"},
              {"date":1437583893374, "open":98.772850179082, "high":101.71137002821457, "low":97.8870194482454, "close":100.14233131359208, "volume":93.72578651127502, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.425+01:00"},
              {"date":1437583894374, "open":100.14233131359208, "high":101.80431306437588, "low":99.33356771157038, "close":99.67693040338, "volume":108.58963762876465, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.425+01:00"},
              {"date":1437583895374, "open":99.67693040338, "high":101.00453125834584, "low":98.13952004041111, "close":99.03858358929905, "volume":107.16633808977114, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.426+01:00"},
              {"date":1437583896374, "open":99.03858358929905, "high":99.17407698820429, "low":98.70513220297566, "close":99.17270438925162, "volume":105.30453057096243, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.427+01:00"},
              {"date":1437583897374, "open":99.17270438925162, "high":101.87882570331445, "low":97.4449164328823, "close":99.31664046142028, "volume":90.068067985026, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.427+01:00"},
              {"date":1437583898374, "open":99.31664046142028, "high":101.68808921173438, "low":98.54130756980426, "close":101.49335733249954, "volume":103.9917150004178, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.428+01:00"},
              {"date":1437583899374, "open":101.49335733249954, "high":102.19811035567042, "low":100.19683048132713, "close":101.9986007002324, "volume":104.69705410878957, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.429+01:00"},
              {"date":1437583900374, "open":101.9986007002324, "high":104.29010136754943, "low":100.31803837898191, "close":102.61054313532503, "volume":104.33942038498644, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.430+01:00"},
              {"date":1437583901374, "open":102.61054313532503, "high":104.56420323909495, "low":101.33114500998651, "close":103.17858209675667, "volume":96.891844072855, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.431+01:00"},
              {"date":1437583902374, "open":103.17858209675667, "high":105.99711590896537, "low":103.02158237356919, "close":103.06911146125306, "volume":92.93214056668864, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.432+01:00"},
              {"date":1437583903374, "open":103.06911146125306, "high":103.83976585864811, "low":101.09427012014858, "close":103.08084588462964, "volume":101.38444370621663, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.432+01:00"},
              {"date":1437583904374, "open":103.08084588462964, "high":104.02234384098053, "low":101.98828818267874, "close":103.09721325678069, "volume":105.57662579424539, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.433+01:00"},
              {"date":1437583905374, "open":103.09721325678069, "high":106.07394438513221, "low":100.55547732497185, "close":102.88831726145028, "volume":97.01022065305622, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.433+01:00"},
              {"date":1437583906374, "open":102.88831726145028, "high":104.76273605639702, "low":100.49713038024987, "close":100.5406820328207, "volume":94.3996029656675, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.434+01:00"},
              {"date":1437583907374, "open":100.5406820328207, "high":101.75076025080743, "low":98.37704160255774, "close":99.32322363794451, "volume":107.82234873258683, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.434+01:00"},
              {"date":1437583908374, "open":99.32322363794451, "high":101.87890374224273, "low":97.9365662360311, "close":98.86584634678682, "volume":108.23285069324987, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.435+01:00"},
              {"date":1437583909374, "open":98.86584634678682, "high":101.72550046786183, "low":96.80119154037284, "close":100.22897923826223, "volume":91.12641881629004, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.435+01:00"},
              {"date":1437583910374, "open":100.22897923826223, "high":102.7126494784059, "low":98.38468778814912, "close":99.0464939474023, "volume":99.80125379166643, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.436+01:00"},
              {"date":1437583911374, "open":99.0464939474023, "high":101.53592077827487, "low":98.134431390725, "close":101.00160023943413, "volume":98.45084086049472, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.438+01:00"},
              {"date":1437583912374, "open":101.00160023943413, "high":102.6364874779807, "low":100.79079598383846, "close":101.75863682153927, "volume":98.22945828808817, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.439+01:00"},
              {"date":1437583913374, "open":101.75863682153927, "high":103.13300540966151, "low":99.36772746658481, "close":102.82322464730174, "volume":100.46866150872826, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.440+01:00"},
              {"date":1437583914374, "open":102.82322464730174, "high":105.78382081343472, "low":101.80081589054306, "close":103.43734790070296, "volume":90.38275647240314, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.440+01:00"},
              {"date":1437583915374, "open":103.43734790070296, "high":103.95664708713723, "low":101.45167480347956, "close":102.51258729210342, "volume":91.88642294487002, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.441+01:00"},
              {"date":1437583916374, "open":102.51258729210342, "high":104.22071993797584, "low":99.88124612028533, "close":103.24313129945985, "volume":99.55782710977425, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.442+01:00"},
              {"date":1437583917374, "open":103.24313129945985, "high":105.52480431228, "low":102.988947607473, "close":104.26873317926726, "volume":97.31568785857266, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.443+01:00"},
              {"date":1437583918374, "open":104.26873317926726, "high":105.83167887037739, "low":102.60777057480645, "close":105.39378767295975, "volume":95.0389515419286, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.444+01:00"},
              {"date":1437583919374, "open":105.39378767295975, "high":107.86318933823355, "low":103.26484142913606, "close":106.0432385945135, "volume":104.14285426682994, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.445+01:00"},
              {"date":1437583920374, "open":106.0432385945135, "high":108.40071315086915, "low":105.1936442456105, "close":106.07070408645475, "volume":91.03533392865806, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.448+01:00"},
              {"date":1437583921374, "open":106.07070408645475, "high":106.60551184201826, "low":106.03967754533227, "close":106.5844184794462, "volume":93.41288877844741, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.448+01:00"},
              {"date":1437583922374, "open":106.5844184794462, "high":107.42737110522387, "low":105.39117697113461, "close":107.06696005445438, "volume":98.51515216737789, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.449+01:00"},
              {"date":1437583923374, "open":107.06696005445438, "high":109.30276248648742, "low":106.23530713452926, "close":108.46949583909722, "volume":104.74259891605033, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.450+01:00"},
              {"date":1437583924374, "open":108.46949583909722, "high":110.23972788117861, "low":107.92213309107639, "close":109.43791617573969, "volume":98.45195895053779, "symbol":"ABC.L", "exchange":"FTSE100", "timestamp":"2015-07-22T17:52:04.451+01:00"},

            ]
      }];

      this.list = function() {
        return items;
    };

      this.add = function(item) {
          items.push(item);
      };

  });
