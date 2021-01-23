{{%CLASS%.js}}
%CLASS%.template = null;
%CLASS%.templateText = `
<style>{{%CLASS%.css}}</style>
{{%CLASS%.html}}
`;
customElements.define("%ELEMENT%", %CLASS%);