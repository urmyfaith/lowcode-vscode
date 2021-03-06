import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { history, useParams, useModel } from 'umi';
import { callVscode } from '@/webview';
import CodeMirror from '@/components/CodeMirror';

export default () => {
  const { setTab } = useModel('tab');
  const [formData, setFormData] = useState<{
    name: string;
    template: string;
    model: string;
    schema: string;
    preview: string;
  }>({
    model: '{}',
    schema: '{}',
    preview: JSON.stringify(
      {
        title: '',
        description: '',
        img:
          'https://gitee.com/img-host/img-host/raw/master//2020/11/05/1604587962875.jpg',
      },
      null,
      2,
    ),
  } as any);

  const params = useParams<{ time: string }>();

  useEffect(() => {
    setFormData(s => {
      return {
        ...s,
        template: localStorage.getItem('addSnippets') || '',
      };
    });
  }, [params.time]);

  return (
    <div>
      <Form
        {...{
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }}
      >
        <Form.Item label="名称" required>
          <Input
            value={formData.name}
            placeholder="输入名称"
            onChange={e => {
              const { value } = e.target;
              setFormData(s => {
                return {
                  ...s,
                  name: value,
                };
              });
            }}
          />
        </Form.Item>
        <Form.Item label="代码片段" required>
          <CodeMirror
            domId="codeMirror"
            lint={false}
            value={formData.template}
            onChange={value => {
              setFormData(s => {
                return {
                  ...s,
                  template: value,
                };
              });
            }}
          />
        </Form.Item>
        <Form.Item label="模板数据">
          <CodeMirror
            domId="modelCodeMirror"
            lint
            value={formData.model}
            onChange={value => {
              setFormData(s => {
                return {
                  ...s,
                  model: value,
                };
              });
            }}
          />
        </Form.Item>
        <Form.Item label="模板 Schema">
          <CodeMirror
            domId="schemaCodeMirror"
            lint
            value={formData.schema}
            onChange={value => {
              setFormData(s => {
                return {
                  ...s,
                  schema: value,
                };
              });
            }}
          />
        </Form.Item>
        <Form.Item label="更多描述">
          <CodeMirror
            domId="previewCodeMirror"
            lint
            value={formData.preview}
            onChange={value => {
              setFormData(s => {
                return {
                  ...s,
                  preview: value,
                };
              });
            }}
          />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Button
          shape="round"
          type="primary"
          onClick={() => {
            if (!formData.name || !formData.template) {
              message.error('请完善必填信息');
              return;
            }
            callVscode(
              { cmd: 'addSnippets', data: formData },
              () => {
                message.success('添加成功');
              },
              () => {},
            );
          }}
          style={{ width: '50%' }}
        >
          添加代码片段
        </Button>
        <Button
          shape="round"
          onClick={() => {
            setTab('/snippets');
            history.push('/snippets');
          }}
          style={{ width: '50%' }}
        >
          返回
        </Button>
      </div>
    </div>
  );
};
