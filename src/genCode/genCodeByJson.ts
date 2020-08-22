import { window } from 'vscode';
import { compile } from 'json-schema-to-typescript';
import { getCodeTemplateListFromFiles } from '../config';
import {
  getFuncNameAndTypeName,
  jsonToTs,
  pasteToMarker,
  formatSchema,
} from '../lib';
import { compile as compileHbs } from '../compiler/hbs';
import { compile as compileEjs } from '../compiler/ejs';
const GenerateSchema = require('generate-schema');
const strip = require('strip-comments');

export const genCodeByJson = async (jsonString: string) => {
  // const templateList = getCodeTemplateList();
  const templateList = getCodeTemplateListFromFiles();
  if (templateList.length === 0) {
    window.showErrorMessage('请配置模板');
    return;
  }
  const selectInfo = getFuncNameAndTypeName();

  const templateResult = await window.showQuickPick(
    templateList.map((s) => s.name),
    { placeHolder: '请选择模板' },
  );
  if (!templateResult) {
    return;
  }
  const template = templateList.find((s) => s.name === templateResult);
  try {
    //const ts = await jsonToTs(selectInfo.typeName, jsonString);
    const json = JSON.parse(jsonString);
    const schema = GenerateSchema.json('Schema', json);
    let ts = await compile(schema, selectInfo.typeName, {
      bannerComment: undefined,
    });
    ts = strip(ts.replace(/(\[k: string\]: unknown;)|\?/g, ''));
    const { mockCode, mockData } = formatSchema(schema);
    const code =
      template?.type === 'hbs'
        ? compileHbs(template!.template, {
            type: ts,
            funcName: selectInfo.funcName,
            typeName: selectInfo.typeName,
            inputValues: selectInfo.inputValues,
            mockCode,
            mockData,
            jsonData: json,
            jsonKeys: Object.keys(json),
          })
        : compileEjs(template!.template, {
            type: ts,
            funcName: selectInfo.funcName,
            typeName: selectInfo.typeName,
            inputValues: selectInfo.inputValues,
            mockCode,
            mockData,
            jsonData: json,
            jsonKeys: Object.keys(json),
          });
    pasteToMarker(code);
  } catch (e) {
    window.showErrorMessage(e.toString());
    return;
  }
};
