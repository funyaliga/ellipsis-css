import React, { memo } from 'react';
import { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select } from 'antd';

const getTextWidth = (text, font) => {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  context.fontSize = '14px';
  const metrics = context.measureText(text);
  return metrics.width;
}

const copyToClp = (txt) => {
  txt = document.createTextNode(txt);
  var m = document;
  var w = window;
  var b = m.body;
  b.appendChild(txt);
  if (b.createTextRange) {
      var d = b.createTextRange();
      d.moveToElementText(txt);
      d.select();
      m.execCommand('copy');
  } else {
      var d = m.createRange();
      var g = w.getSelection;
      d.selectNodeContents(txt);
      g().removeAllRanges();
      g().addRange(d);
      m.execCommand('copy');
      g().removeAllRanges();
  }
  txt.remove();
}

const updateCss = (fontSize, fontFamily, lineHeight, maxLine, moreWidth) => {
  let $style = document.querySelector('#ellipsisCss');
  const dotdotdotWidth = getTextWidth("…", `16px ${fontFamily}`)
  const clampFontSize = moreWidth / dotdotdotWidth * 16;
  console.log(clampFontSize)
  if (!$style) {
    $style = document.createElement('style');
    $style.id = 'ellipsisCss';
    document.querySelector('head').appendChild($style);
  }
  const style = `.ellipsis {
  position: relative;
  max-height: ${lineHeight * maxLine}px;
  line-height: ${lineHeight}px;
  text-align: justify;
  font-family: ${fontFamily};
  white-space: pre-line;
  overflow: hidden;
}
.ellipsis-container {
  position: relative;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${maxLine};
  font-size: ${clampFontSize}px;
  color: transparent;
}
.ellipsis-content {
  display: inline;
  vertical-align: top;
  font-size: ${fontSize}px;
  color: #000;
}
.ellipsis-ghost {
  position:absolute;
  z-index: 1;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  color: #000;
}
.ellipsis-ghost:before {
  content: "";
  display: block;
  float: right;
  width: 50%;
  height: 100%;
}
.ellipsis-placeholder {
  display: block;
  float: right;
  width: 50%;
  height: ${lineHeight * maxLine}px;
}
.ellipsis-more {
  position: relative;
  float: right;
  font-size: ${fontSize}px;
  width: ${moreWidth}px;
  height: ${lineHeight}px;
  margin-top: ${-lineHeight}px;
}`;

  $style.innerHTML = style;
  return style;
}

const EllipsisCss = memo(props => {
  const [ fontSize, setFontSize ] = useState(16);
  const [ fontFamily, setFontFamily ] = useState('"PingFang SC"');
  const [ lineHeight, setLineHeight ] = useState(24);
  const [ maxLine, setMaxLine ] = useState(5);
  const [ moreWidth, setMoreWidth ] = useState(128);
  const [ text, setText ] = useState('从一眼望穿的生活中逃离，究竟有多难？很多时候，玛丽都觉得自己的人生索然无味，曾经，她也怀揣梦想，意气风发。她以全部的热情投入生活当中，为家人奉献一切，却唯独失去了自我。然而日复一日，丈夫对她也越来越无视，连孩子们都觉得母亲应该去过真正属于自己的生活。终于有一天，在她的丈夫40岁生日这一天，她决定给他一个惊喜：她独自踏上了环球航行的游轮，希望能从一眼望穿的生活中逃离，给自己一个重生的机会。她遇见了各种各样的人，每个人都有自己的困境，也终于在这趟旅程中找到了疗愈自己的方法。');

  const _style = updateCss(fontSize, fontFamily, lineHeight, maxLine, moreWidth)

  return (
    <Form style={{ width: '980px', margin: '20px auto' }}>
      <Row style={{ margin: '20px 0', background: '#eee'}} type="flex" gutter={20}>
        <Col span={6}>
          <Form.Item label="font size 字体大小">
            <Input
              type="number"
              onChange={e => setFontSize(e.target.value)}
              addonAfter="px"
              value={fontSize}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="line height 行高">
            <Input
              type="number"
              onChange={e => setLineHeight(e.target.value)}
              addonAfter="px"
              value={lineHeight}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="max of lines 最大行数">
            <Input
              type="number"
              onChange={e => setMaxLine(e.target.value)}
              value={maxLine}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="truncation width 截断的宽度">
            <Input
              type="number"
              onChange={e => setMoreWidth(e.target.value)}
              value={moreWidth}
              addonAfter="px"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="text 文本">
            <Input.TextArea
              autosize={{ minRows: 2, maxRows: 6 }}
              onChange={e => setText(e.target.value)}
              value={text}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="font family 字体">
            <Input
              onChange={e => setFontFamily(e.target.value)}
              value={fontFamily}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row style={{ margin: '20px 0'}} type="flex" gutter={20}>
        <Col span={12}>
          <h3>preview (预览)</h3>
          <div style={{ border: '1px solid #eee', padding: '12px'}}>
            <div className="ellipsis">
              <div className="ellipsis-container">
                <div className="ellipsis-content">{ text }</div>
                <div className="ellipsis-ghost">
                  <div className="ellipsis-placeholder"></div>
                  <div href="javascript:" className="ellipsis-more">...more</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <h3>generate css (生成css) <a onClick={() => copyToClp(_style)}>复制</a></h3>
          <div style={{ height: '400px', border: '1px solid #eee', padding: '12px', overflowY: 'scroll' }}>
            <pre style={{ margin: 0 }}>{ _style }</pre>
          </div>
        </Col>
      </Row>
    </Form>
  );
})

export default EllipsisCss;