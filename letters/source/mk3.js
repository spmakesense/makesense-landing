const fs=require('fs');const{Document,Packer,Paragraph,ImageRun}=require('docx');
const d=new Document({sections:[{properties:{page:{margin:{top:0,bottom:0,left:0,right:0,header:0,footer:0}}},children:[new Paragraph({spacing:{before:0,after:0},children:[new ImageRun({type:'png',data:fs.readFileSync(process.argv[2]+'/flyer.png'),transformation:{width:793,height:1121}})]})]}]});
Packer.toBuffer(d).then(b=>fs.writeFileSync(process.argv[3],b));
