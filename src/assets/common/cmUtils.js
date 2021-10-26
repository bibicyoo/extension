const CmConfig = {
  messageType: {success : 'success', info : 'info', warning : 'warning', error : 'error'},
  tableList: {tagetPath: 'tagetPath', memo : 'memo', tag : 'userTagList'},
};

const CmFnc = {
  leftPad : function (value) {
    if (value >= 10) {
      return value;
    } 
    return `0${value}`;
  },
  getDateToString : function (date, delimiter = '-'){
    const year = date.getFullYear();
    const month = this.leftPad(date.getMonth() + 1);
    const day = this.leftPad(date.getDate());
    return [year, month, day].join(delimiter);
  },
  printMessage: function (that, message, type, duration){
    duration = duration == null ? 700 : duration;
    type = message == null ? this.messageType.error : type;

    that.$message({
      message: message,
      type: type,
      duration: duration
    });
  },
  setSubmitForm: function (form, structure) {
    let data = {};
    structure.forEach(item => {
      if (form[item.valueNm] !== null) {
        if (item.dataNm !== null) {
          data[item.dataNm] = form[item.valueNm];
        } else {
          data[item.valueNm] = form[item.valueNm];
        }
      }
    });
    return data;
  },
};

const CmUtils = {
  ...CmConfig,
  ...CmFnc,
  setStorage: async function (objNm, obj) {
    return new Promise(function(resolve, reject){
      try {
        chrome.storage.sync.set({[objNm]: obj}, () => {
          console.log('chrome.storage.sync.set=', obj);
          resolve(obj);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  },
  setStorageByArray: async function (objNm, obj, id) {
    return CmUtils.getStorage(objNm).then(function (value) {
      let arrayObject;
      if (value !== undefined && value != null) {
        arrayObject = value;
        if (obj.length > 0) {
          obj.forEach(objLine => {
            arrayObject.push(objLine);
          });
        }

        const hashSet = arrayObject.filter((item, i) => {
          return (
            arrayObject.findIndex(item2 => {
              return item[id] == item2[id];
            }) == i);
        });
        arrayObject = hashSet;
      } else {
        arrayObject = obj;
      }
      CmUtils.setStorage(objNm, arrayObject);
    });
  },
  getStorage: async function(objNm) {
    return new Promise(function(resolve, reject){
      try {
        chrome.storage.sync.get([objNm], (result) => {
          console.log('chrome.storage.sync.get=', result[objNm]);
          resolve(result[objNm]);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  },
  removeStorage: async function(objNm) {
    return new Promise(function(resolve, reject){
      try {
        chrome.storage.sync.remove([objNm], () => {
          console.log('chrome.storage.sync.remove=', objNm);
          resolve(objNm);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  },
  removeStorageByArray: async function (objNm, obj, id) {
    let arrayObject = [];
    try {
      arrayObject = await CmUtils.getStorage(objNm);
      if (arrayObject != null && arrayObject.length > 0) {
        let idx = -1;
        idx = arrayObject.findIndex(item => {
          return item[id] === obj;
        });
        if (idx > -1) {
          arrayObject.splice(idx, 1);
          await CmUtils.setStorage(objNm, arrayObject);
        }
      }
    } catch (ex) {
      console.log.error(ex);
    }
    return arrayObject;
  },
  getSeq: function (table){
    let seq = null;
    if (table !== null) {
      let date = new Date();
      seq = table + '_' + date.getTime();
      console.log('cmutils.getSeq=', seq);
    }
    return seq;
  }
};

export default CmUtils;