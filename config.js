/**
 * Created by jonghyeok on 2017-04-05.
 */

/**
 * 모듈
 * */
var jsdom = require('jsdom').jsdom;
var fs = require('fs');
var _ = require('underscore');

/**
 * 전역 변수
 * */
global.document = jsdom('helloworld');
global.window = document.defaultView;

(function () {
    //외부에 제공하는 함수
    var Config = {};

    var baseFn = Config.baseFn = {
        //DOM 형식의 Polymer 기본 템플릿을 반환
        getPolymerBaseTmp: function () {
            var templateString = fs.readFileSync('./polymer_base_tmp.html', 'utf-8');
            return jsdom(templateString);
        },
        transformView: function (tmp, extObj, config, xtypeConfig) {

        }
    };

    //ViewModel Config
    var vmConfig = Config.vmConfig = {};

    //ViewController Config
    var vcConfig = Config.vcConfig = {};

    //View Config
    var viewConfig = Config.viewConfig = {
        title: {
            tagName: 'cc-sub-title-bar',
            value: function (dom, value) {
                var tag;
                if(dom.nodeName === "TEMPLATE-ZONE") { //최상위라면
                    tag = document.createElement('cc-page-title-bar');
                    tag.setAttribute("page-title", value);
                } else {
                    tag = document.createElement(this.tagName);
                    tag.setAttribute("title", value);
                }

                dom.appendChild(tag);
            }
        },
        readOnly: {
            value: function (dom, value) {

                dom.setAttribute('disabled', value);
            }
        },
        disabled: {
            value: function (dom, value) {
                dom.setAttribute('disabled', value);
            }
        },
        allowBlank: {
            value: function (dom, value) {
                dom.setAttribute('required', !value);
            }
        },
        forceSelection: {
            value: function (dom, value) {
                dom.setAttribute('required', value);
            }
        },
        width: {
            value: function (dom, value) {
                if(!_.isNaN(value)) {
                    dom.setAttribute('width', value);
                }
            }
        },
        height: {
            value: function (dom, value) {
                dom.setAttribute('height', value);
            }
        },
        //reference => id 작업은 엘리먼트를 생성할 때
        //xtype에서 return dom을 할 경우 dom이 교체되는 현상이 있어서
        /*reference: {
         value: function (dom, value) {
         dom.setAttribute('id', value);
         }

         },*/
        editable: {
            value: function (dom, value) {
                dom.setAttribute('disabled', value);
            }
        },
        layout: {
            value: function (dom, currObj, parentObj) {
                if(_.isObject(currObj) && currObj.type) {

                    var ele;
                    if(parentObj.isType === "em") {
                        ele = document.createElement('sc-pages');
                        ele.setAttribute('selected', 0);
                        addClass(ele, "fit");

                        var items = parentObj.items || [];
                        for(var i=0,len=items.length; i<len; i++) {
                            var item = items[i];
                            var scPageObj = _.findWhere(global.extList, {alias: 'widget.' + item.xtype});

                            console.error("[" +item.xtype+ "]", scPageObj && scPageObj.is);

                            if(scPageObj) {
                                var scPage = document.createElement(scPageObj.isType + "-" + scPageObj.is);

                                if(item.lazy) {
                                    var tmp = document.createElement('template-zone');
                                    tmp.appendChild(scPage);
                                    ele.appendChild(tmp);
                                } else {
                                    ele.appendChild(scPage);
                                }
                            }
                        }

                        //ele = document.createElement(parentObj.isType + "-" + parentObj.is);
                        dom.appendChild(ele);
                    } else {
                        var ele = document.createElement('div');

                        if(dom.nodeName === "TEMPLATE-ZONE") {  //최상위라면
                            addClass(ele, (currObj.type === "column") ? "fit" : "flex");
                        } else {
                            addClass(ele, currObj.type);
                        }
                    }

                    dom.appendChild(ele);

                    return {
                        parentDom: ele
                    };
                } else {

                }
            }
        },
        fieldLabel: {
            tagName: 'fieldLabel',
            value: function (dom, value) {

                //
                // //데이터가 추가될 위치를 구함, 무조건
                // var table = dom.parentNode;
                // while(true) {
                //
                //     table = table.parentNode;
                //
                //     if(table.nodeName === "TABLE") {
                //         break;
                //     }
                //
                //     //기존에 상위에 검색 테이블에 Table 엘리먼트가 없으면 새롭게 만들어준다
                //     if(table.nodeName === "CC-SEARCH-CONTAINER") {
                //         var newTable = document.createElement('table');
                //         table.appendChild(newTable);
                //         table = newTable;
                //     }
                // }

                var parent = dom.parentNode;

                //기존에 상위에 검색 테이블에 Table 엘리먼트가 없으면 새롭게 만들어준다
                var table = parent.querySelector('table');

                if(parent.nodeName === "TABLE") {
                    table = parent;
                } else if(!table) {
                    table = document.createElement('table');
                    parent.appendChild(table);
                }

                var trList = table.querySelectorAll('tr');
                var lastTr = trList[trList.length - 1];
                if(table.parentNode.nodeName === "CC-SEARCH-CONTAINER" && lastTr && lastTr.querySelectorAll('td').length < 3) {
                    tr = lastTr;
                } else {
                    var tr = document.createElement('tr');
                    table.appendChild(tr);
                }


                //tr / td 추가
                var th = document.createElement('th');
                var scLabel = document.createElement('sc-label');
                scLabel.setAttribute('text', value);
                th.appendChild(scLabel);

                var td = document.createElement('td');
                td.appendChild(dom);

                tr.appendChild(th);
                tr.appendChild(td);
            }
        },
        columns: {
            value: function (dom, items) {
                items.forEach(function (item) {
                    if(item.xtype) {
                        if(xtypeConfig[item.xtype]) {
                        }
                        configConvert(dom, item);
                    }
                });
            }
        },
        dockedItems: {
            value: function (dom, items) {
                items.forEach(function (item) {
                    if(item.xtype) {
                        if(xtypeConfig[item.xtype]) {
                        }
                        configConvert(dom, item);
                    }
                });
            }
            /*value: function (dom, dockItems) {
             var xtypeConfig = Config.viewXtypeConfig;

             for(var i=0, len=dockItems.length; i<len; i++) {
             var dockItem = dockItems[i];
             var xtype = dockItem.xtype;

             var component = xtypeConfig[xtype];
             /!* TODO 함수형으로 변경 *!/
             var title = _.findWhere(dockItem.items, {xtype: 'tbtext'});
             title = title ? title.text : undefined;
             var createdDom = _.isFunction(component.value) ? component.value.call(component, dom, title) : component.value;
             }
             }*/
        },
        items: {
            value: function (dom, items) {
                items.forEach(function (item) {
                    if(item.xtype) {
                        if(xtypeConfig[item.xtype]) {
                        }
                        configConvert(dom, item);
                    }
                });
            }
        },
        listeners: {
            value: function (dom, events) {
                var except = [
                    'afterrender'
                ];

                for(var eventName in events) {
                    if(events.hasOwnProperty(eventName) && (except.indexOf(eventName) < 0)) {
                        dom.setAttribute("on-" + eventName, events[eventName]);
                    }
                }
            }
        }
    };

    var xtypeConfig = Config.viewXtypeConfig = {
        tbtext: {
            tagName: 'sc-label',
            createdCallback: function (dom, value) {
                dom.setAttribute('text', value.text);
            }
        },
        toolbar: {
            tagName: 'cc-sub-title-bar',
            config: {
                layout: {}  //toolbar에서 지정한 layout은 제외
            },
            createdCallback: function (dom, value, parentDom) {
                //sc-grid 밑에 toolbar config

                if(parentDom.tagName === "SC-GRID") {
                    var tb = parentDom.querySelector('cc-grid-toolbar');
                    if(!tb.getAttribute('title-text')) {
                        var titleObj = _.findWhere(value.items, {xtype: 'label'})
                        if(titleObj && titleObj.text) {
                            tb.setAttribute('title-text', titleObj.text);
                        }
                    }
                    return tb;
                } else if(parentDom.tagName === "CC-SEARCH-CONTAINER") {
                    return 'remove';
                }
            }
        },
        /*<sc-combobox-field class="w-110" value="{{baseInfo.cur}}" items="{{codes.cur}}" display-field="label" value-field="data" placeholder="선택"></sc-combobox-field>*/
        combobox: {
            tagName: 'sc-combobox-field',
            createdCallback: function (dom, value) {
                dom.setAttribute('value', value.value);

                //TODO 데이터가 정확하지 않을 수 있음
                dom.setAttribute('display-field', value.displayField);
                dom.setAttribute('value-field', value.valueField);

                //TODO
                if(value.emptyText) {
                    dom.setAttribute('placeholder', value.emptyText);
                }
            }
        },
        displayfield: {
            tagName: 'sc-label',
            config: {
                fieldLabel: {}
            },
            createdCallback: function (dom, value) {
                dom.setAttribute('text', value.value);
            }
        },
        textfield: {
            tagName: 'sc-text-field',
            config: {
                width: {}
            },
            createdCallback: function (dom, value) {
                dom.setAttribute('value', value.value);

                if(!_.isNaN(value.width)) {
                    dom.setAttribute('width', value.width);
                }
            }
        },
        //TODO
        container: {
            tagName: 'sc-panel',
            config: {
                layout: {}
            },
            createdCallback: function (dom, value, parentDom) {
                /*if(parentDom.nodeName === 'CC-SEARCH-CONTAINER') {

                    //조회 조건에서 테이블은 하나만 생성. 기존에 있으면 그걸 가져다 쓴다
                    var originTable;

                    console.log(parentDom.nodeName);


                    if(originTable = parentDom.querySelector('table')) {
                        console.log(originTable);
                        return originTable;
                    }

                    return table;
                }*/

                if(parentDom.nodeName === "CC-SEARCH-CONTAINER") {
                    return parentDom.querySelector('table');
                }

                if(value.items && value.items[0] && value.items[0].title) {
                    dom.setAttribute('title', value.items[0].title);
                }
            }
        },
        //TODO
        panel: {
            tagName: 'sc-panel',
            createdCallback: function (dom, value, parentDom) {
                if(value.items && value.items[0] && value.items[0].title) {
                    dom.setAttribute('title', value.items[0].title);
                }
            }
        },
        textareafield: {
            tagName: 'sc-textarea-field',
            createdCallback: function (dom, value) {
                dom.setAttribute('value', value.value);
            }
        },
        form: {
            tagName: 'table',
            config: {
                layout: {}
            },
            createdCallback: function (dom, value) {
                if(value.ui === 'search') {
                    //조회 홈 (cc-search-container)
                    var container = document.createElement('cc-search-container');

                    commonDomUtil.makeSearchColGroup(container);

                    return container;
                } else {
                    //일반 폼
                    addClass(dom, 'tb-form');
                }
            }
        },
        button: {
            tagName: 'sc-button',
            config: {
                listeners: {}
            },
            createdCallback: function (dom, value, parentDom) {
                dom.setAttribute('text', value.text);

                if(parentDom.nodeName === 'CC-SEARCH-CONTAINER') {
                    if(value.iconCls === 'btn-search') { //조회 버튼 일 경우
                        parentDom.setAttribute('on-search', (value.listeners && value.listeners.click) ? value.listeners.click : "");
                        return 'remove'
                    } else if(value.iconCls === 'btn-refresh') { //reset 버튼 일 경우, 그냥 삭제
                        return 'remove';
                    } else if(value.iconCls === 'btn-expand') {
                        return 'remove';
                    } else {
                        if(value.listeners && value.listeners.click) {
                            dom.setAttribute('on-click', value.listeners.click); //나머지 sc-button에 대해서는 이벤트 등록
                        }
                    }
                }
            }
        },
        treepanel: {
            tagName: 'sc-grid',
            config: {
                title: {}
            },
            createdCallback: function (dom ,value) {
                //cc-grid-toolbar
                var toolbar = document.createElement('cc-grid-toolbar');
                if(value.title) {
                    toolbar.setAttribute("title-text", value.title);
                }
                dom.appendChild(toolbar);

                //sc-grid-columns
                var gridColunns = document.createElement('sc-grid-columns');
                dom.appendChild(gridColunns);

                //sc-grid
                if(value.flex) {
                    addClass(dom, getFlexClassString(value.flex));
                }
                dom.setAttribute('is-tree', true);
            }
        },
        gridpanel: {
            tagName: 'sc-grid',
            config: {
                title: {}
            },
            createdCallback: function (dom ,value) {
                //cc-grid-toolbar
                var toolbar = document.createElement('cc-grid-toolbar');
                if(value.title) {
                    toolbar.setAttribute("title-text", value.title);
                }
                dom.appendChild(toolbar);

                //sc-grid-columns
                var gridColunns = document.createElement('sc-grid-columns');
                dom.appendChild(gridColunns);

                //sc-grid
                if(value.flex) {
                    addClass(dom, getFlexClassString(value.flex));
                }
            }
        },
        etnadataactioncolumn: {
            tagName: 'sc-data-column',
            createdCallback: function (dom, value, parentDom) {
                //	data-field="vd_cd"	header-text="협력사코드"
                dom.setAttribute('data-field', value.dataIndex);
                dom.setAttribute('header-text', value.text);
                dom.setAttribute('width', value.width || 150); //width는 없으면 기본 값을 넣어주도록
                if(value.align && !(value.align === 'center')) { //align이 있으면서 center가 아니라면 (default가 center이므로 제외함)
                    dom.setAttribute('text-align', value.align);
                }

                /*여기만 중복안됨 */
                dom.setAttribute('style-name', 'link');

                if(parentDom.nodeName !== "SC-GRID-COLUMNS") {
                    var existToolbar;
                    if(existToolbar = parentDom.querySelector('sc-grid-columns')) { //기존에 sc-grid-columns가 있으면 거기에 추가
                        existToolbar.appendChild(dom);
                        return existToolbar;
                    } else {
                        var newParent = document.createElement('sc-grid-columns'); //기존에 없으면 새롭게 만들어서 추가
                        newParent.appendChild(dom);
                        return newParent;
                    }
                }
            }
        },
        gridcolumn: {
            tagName: 'sc-data-column',
            createdCallback: function (dom, value, parentDom) {
                //	data-field="vd_cd"	header-text="협력사코드"
                dom.setAttribute('data-field', value.dataIndex);
                dom.setAttribute('header-text', value.text);
                dom.setAttribute('width', value.width || 150); //width는 없으면 기본 값을 넣어주도록
                //TODO placeholder
                if(value.emptyCellText) {
                    dom.setAttribute('placeholder', value.emptyCellText);
                }
                if(value.align && !(value.align === 'center')) { //align이 있으면서 center가 아니라면 (default가 center이므로 제외함)
                    dom.setAttribute('text-align', value.align);
                }

                if(parentDom.nodeName !== "SC-GRID-COLUMNS") {
                    var existToolbar = parentDom.querySelector('sc-grid-columns')
                    existToolbar.appendChild(dom);
                    return existToolbar;
                }
            }
        },
        gridcolumn: {
            tagName: 'sc-data-column',
            createdCallback: function (dom, value, parentDom) {
                //	data-field="vd_cd"	header-text="협력사코드"
                dom.setAttribute('data-field', value.dataIndex);
                dom.setAttribute('header-text', value.text);
                dom.setAttribute('width', value.width || 150); //width는 없으면 기본 값을 넣어주도록
                //TODO placeholder
                if(value.emptyCellText) {
                    dom.setAttribute('placeholder', value.emptyCellText);
                }
                if(value.align && !(value.align === 'center')) { //align이 있으면서 center가 아니라면 (default가 center이므로 제외함)
                    dom.setAttribute('text-align', value.align);
                }

                var existToolbar = parentDom.querySelector('sc-grid-columns');
                existToolbar.appendChild(dom);
                return existToolbar;
            }
        },
        treecolumn: {
            tagName: 'sc-data-column',
            createdCallback: function (dom, value, parentDom) {
                //	data-field="vd_cd"	header-text="협력사코드"
                dom.setAttribute('data-field', value.dataIndex);
                dom.setAttribute('header-text', value.text);
                dom.setAttribute('width', value.width || 150); //width는 없으면 기본 값을 넣어주도록
                //TODO placeholder
                if(value.emptyCellText) {
                    dom.setAttribute('placeholder', value.emptyCellText);
                }
                if(value.align && !(value.align === 'center')) { //align이 있으면서 center가 아니라면 (default가 center이므로 제외함)
                    dom.setAttribute('text-align', value.align);
                }

                var existToolbar = parentDom.querySelector('sc-grid-columns');
                existToolbar.appendChild(dom);
                return existToolbar;
            }
        },
        datecolumn: {
            tagName: 'sc-date-column',
            createdCallback: function (dom, value, parentDom) {
                //	data-field="vd_cd"	header-text="협력사코드"
                dom.setAttribute('data-field', value.dataIndex);
                dom.setAttribute('header-text', value.text);
                dom.setAttribute('width', value.width || 150); //width는 없으면 기본 값을 넣어주도록
                if(value.align && !(value.align === 'center')) { //align이 있으면서 center가 아니라면 (default가 center이므로 제외함)
                    dom.setAttribute('text-align', value.align);
                }

                if(parentDom.nodeName !== "SC-GRID-COLUMNS") {
                    var existToolbar;
                    if(existToolbar = parentDom.querySelector('sc-grid-columns')) { //기존에 sc-grid-columns가 있으면 거기에 추가
                        existToolbar.appendChild(dom);
                        return existToolbar;
                    } else {
                        var newParent = document.createElement('sc-grid-columns'); //기존에 없으면 새롭게 만들어서 추가
                        newParent.appendChild(dom);
                        return newParent;
                    }
                }
            }
        },
        fieldcontainer: {
            tagName: 'remove',
            config: {
                layout: {}
            },
            createdCallback: function (dom, value) {
                var items = value.items;
                //sc-period-date-field, 난잡한 코드, from~to 형태의 datefield를 바꿔준다
                if(items[0].xtype === 'datefield' && items[2] && items[2].xtype === 'datefield') {
                    //<sc-period-date-field from-value="{{searchParam.from_po_cre_date}}" to-value="{{searchParam.to_po_cre_date}}" default-from-value="-1M" default-to-value="0d" string-date="true"></sc-period-date-field>
                    var fromToField = document.createElement('sc-period-date-field');

                    if(items[0].bind && items[2].bind) {
                        fromToField.setAttribute('from-value', '{' + items[0].bind.value + '}'); //바인딩, fieldContainerd에서 값을 넣어주기 때문에 bind.value처럼 접근해야함
                        fromToField.setAttribute('to-value', '{' + items[2].bind.value + '}');
                    } else {
                        fromToField.setAttribute('from-value', ''); //바인딩, fieldContainerd에서 값을 넣어주기 때문에 bind.value처럼 접근해야함
                        fromToField.setAttribute('to-value', '');
                    }

                    return fromToField;
                }
            }
        },

        pagingtoolbar: {
            tagName: 'remove',
            config: {
                width: {}
            },
            createdCallback: function (dom, value) {
                return 'remove';
            }
        },

        //TODO
        /*etnaattachmentfield: {
         tagName: 'sc-attachment-column',
         createdCallback: function (dom, value, parentDom) {
         //TODO
         dom.setAttribute('value', value.value);
         }
         },*/
        /*{
         xtype: 'etnastorecolumn',
         60,
         align: 'center',
         dataIndex: 'itemUnit',
         text: '#{단위}',
         valueField: 'id',
         displayField: 'text',
         bind: {
         store: '{unitCodeStore}'
         }
         <sc-combobox-column	data-field="hndl_sts_cd"	header-text="진행상태"	width="80" items="{{codes.hndl_sts_cd}}"
         display-field="dtl_cd_nm" value-field="dtl_cd"	></sc-combobox-column>
         },*/
        etnastorecolumn: {
            tagName: 'sc-combobox-column',
            createdCallback: function (dom, value, parentDom) {
                dom.setAttribute('data-field', value.dataIndex);
                dom.setAttribute('header-text', value.text);
                dom.setAttribute('width', value.width || 150); //width는 없으면 기본 값을 넣어주도록
                if(value.align && !(value.align === 'center')) { //align이 있으면서 center가 아니라면 (default가 center이므로 제외함)
                    dom.setAttribute('text-align', value.align);
                }

                /*Only etnastorecolumn*/
                //TODO 데이터가 정확하지 않을 수 있음
                dom.setAttribute('display-field', value.displayField);
                dom.setAttribute('value-field', value.valueField);

                if(parentDom.nodeName !== "SC-GRID-COLUMNS") {
                    var existToolbar;
                    if(existToolbar = parentDom.querySelector('sc-grid-columns')) { //기존에 sc-grid-columns가 있으면 거기에 추가
                        existToolbar.appendChild(dom);
                        return existToolbar;
                    } else {
                        var newParent = document.createElement('sc-grid-columns'); //기존에 없으면 새롭게 만들어서 추가
                        newParent.appendChild(dom);
                        return newParent;
                    }
                }
            }
        }
    };

    var commonDomUtil = {
        //Search Table 밑에 ColGroup을 생성한다
        makeSearchColGroup: function (parentDom) {
            var table = parentDom.querySelector('table');
            if(!table) {
                table = document.createElement('table');
                parentDom.appendChild(table);
            }

            var colGroup = document.createElement('colgroup');
            for(var i = 0; i < 6; i++) {
                var col = document.createElement('col');

                if(i % 2 === 0) {
                    col.setAttribute('style', 'width:120px');
                }
                colGroup.appendChild(col);
            }
            table.appendChild(colGroup);
        }
    }

    function overrideConfig(baseConfig, overrideConfig) {
        var newConfig = _.clone(baseConfig);
        for(var key in overrideConfig) {
            if(overrideConfig.hasOwnProperty(key)) {
                newConfig[key] = overrideConfig[key];
            }
        }

        return newConfig;
    }

    function configConvert(parentDom, extObj) {
        //Config Override
        var config = _.clone(Config.viewConfig);

        if(!xtypeConfig[extObj.xtype]) {
            var exceptList = [
                'tbspacer'
            ];
            if(exceptList.indexOf(extObj.xtype) < 0) {
                console.error(extObj.xtype, "가 존재하지 않음");
                return;
            }
        }

        if(extObj.xtype && xtypeConfig[extObj.xtype] && extObj.xtype && xtypeConfig[extObj.xtype].config) {
            //xtype의 config로 override
            //var xConfig = _.clone(xtypeConfig);
            config = overrideConfig(config, xtypeConfig[extObj.xtype].config);
        }
        if(extObj.xtype && xtypeConfig[extObj.xtype] && xtypeConfig[extObj.xtype].tagName) {
            var xConfig = xtypeConfig[extObj.xtype];

            //binding obj
            if(extObj.bind) {
                for(var bindName in extObj.bind) {
                    if(extObj.bind.hasOwnProperty(bindName)) {
                        extObj[bindName] = changePolymerBindingChars(extObj.bind[bindName]);
                    }
                }
            }

            //create xtype element
            var newDom = createXtypeElement(xtypeConfig[extObj.xtype], extObj, parentDom);
            if(newDom) {
                parentDom.appendChild(newDom);
                parentDom = newDom;
            }

            function changePolymerBindingChars(originBind) {
                return '{' + originBind + '}';
            }
        }
        //
        for(var key in extObj) {
            if(extObj.hasOwnProperty(key) && (convertConfig = config[key])) {
                var extValue = extObj[key];


                var result = _.isFunction(convertConfig.value) ? convertConfig.value.call(convertConfig, parentDom, extValue, extObj) : convertConfig.value;
                if(result) {
                    parentDom = result.parentDom || parentDom;
                }
            }
        }
    }

    function createXtypeElement(obj, extObj, parentDom) {
        var tag = document.createElement(obj.tagName);

        //id 지정
        if(extObj.reference || extObj.itemId) {
            tag.setAttribute('id', extObj.reference || extObj.itemId);
        }

        //xtypeConfig의 createdCallback을 호출
        if(_.isFunction(obj.createdCallback)) {
            result = obj.createdCallback(tag, extObj, parentDom);
            //반환값이 remove라면 아무것도 반환하지 않는다.
            if(result === 'remove') {
                return undefined;
            }
            tag = result || tag;
        }

        return tag;

    }

    function getFlexClassString(flex) {
        if(flex) {
            flex *= 10
            if(flex >= 10) {
                return "flex";
            } else if(0 < flex < 10) {
                return "flex-" + (flex);
            } else{
                console.error("flex값이 유효하지 않습니다.");
            }
        }
        return undefined;
    }

    function addClass(dom, clazz) {
        dom.classList ? dom.classList.add(clazz) : dom.className += ' ' + clazz;
    }

    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Config;
        }
        exports.UTIL = Config;
    } else {
        root.UTIL = Config;
    }
})();