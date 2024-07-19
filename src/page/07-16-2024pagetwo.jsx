import React,{useEffect,useState} from 'react'
import Bar from '../component/bar';
import { useNavigate,useParams } from 'react-router-dom'
import axios from 'axios';


/*
    TODO ตรงความสามารถพิเศษมีให้กรอกแค่นิดเดียว
    TODO ใส่ตารางมาพร้อมหลังบ้าน
    TODO เพิ่มปุ่มกดกลับ
*/
export default function PageTwo() {
  return (
    <div>
         <div style={{ display: 'flex' }}>
                <Bar />
                <PageTwO />
            </div>
    </div>
  )
}

function PageTwO(){
    const navigate = useNavigate();
    const [data,setData] = useState('')
    const { id } = useParams();


    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:3200/applications/${id}`); // Replace '123' with the actual _id
            setData(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        fetchData();
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    

    const handleFileClick = (filePath) => {
        window.open(filePath, '_blank');
        
    };
  

    return(
        <div>
            <div style={{display:'flex',textAlign:'center',alignContent:'center',justifyContent:'center'}}>
                <p style={{fontSize:'28px',margin:'1rem'}}>ใบรับสมัครพนักงาน</p>
            </div>

            <p style={{textAlign:'center',margin:'3rem 0 0'}}><strong> ประวัติการศึกษา</strong></p>
            <table style={{margin:'1rem 0'}}>
                <thead style={{backgroundColor:'#EF4923',borderCollapse: 'collapse'}}>
                    <tr>
                        <th style={{padding:'0.4rem 2rem',}}>วุฒิการศึกษา</th>
                        <th style={{padding:'0.4rem 2rem',}}>สถาบันการศึกษา</th>
                        <th style={{padding:'0.4rem 2rem',}}>ที่ตั้ง</th>
                        <th style={{padding:'0.4rem 2rem',}}>ระยะเวลาที่ศึกษา ตั้งแต่ต้นจนจบ</th>
                    </tr>
                </thead>
                <tbody style={{ marginTop:'1rem' }}>
                    <tr>
                        <td colSpan="4" style={{ height: '0.1rem' }}></td>
                    </tr>
                    {data.education_history && data.education_history.length > 0 ? (
                        data.education_history.map((edu, index) => (
                            <tr key={index} style={{ marginTop: '1rem' }}>
                                <td style={{textAlign:'center',border:'1px solid #676767',padding:'3px'}}>{edu.degree}</td>
                                <td style={{textAlign:'center',border:'1px solid #676767',padding:'3px'}}>{edu.institution_name}</td>
                                <td style={{textAlign:'center',border:'1px solid #676767',padding:'3px'}}>{edu.location}</td>
                                <td style={{textAlign:'center',border:'1px solid #676767',padding:'3px'}}>{edu.study_period}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{textAlign:'center',border:'1px solid #676767'}}>ไม่มีข้อมูลการศึกษา</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <p style={{textAlign:'center',marginTop:'3rem'}}><strong>ประวัติการทำงาน</strong></p>
            <table style={{margin:'1rem 0'}}>
                <thead style={{backgroundColor:'#EF4923',borderCollapse: 'collapse'}}> 
                    <tr>
                        <th style={{padding:'0.4rem 2rem'}}>ระยะเวลาทำงาน</th>
                        <th style={{padding:'0.4rem 2rem'}}>ชื่อสถานที่ทำงานและที่อยู่</th>
                        <th style={{padding:'0.4rem 2rem'}}>ดำแหน่งที่รับผิดชอบ</th>
                        <th style={{padding:'0.4rem 2rem'}}>เงินเดือนครั้งสุดท้าย</th>
                        <th style={{padding:'0.4rem 2rem'}}>สาเหตุที่ลาออก</th>
                    </tr>
                </thead>
                <tbody>  
                    <tr>
                         <td colSpan="5" style={{ height: '0.1rem' }}></td>
                     </tr>
                    {data.work_experience && data.work_experience.length > 0 ? (
                        data.work_experience.map((edu,index) => (
                    <tr key={index}>
                        <td style={{textAlign:'center',border:'1px solid #676767',padding:'3px'}}>{edu.years_worked} ปี {edu.start_year} - {edu.end_year}</td>
                        <td style={{textAlign:'center',border:'1px solid #676767',padding:'3px'}}>{edu.company_name} {edu.address}</td>
                        <td style={{textAlign:'center',border:'1px solid #676767',padding:'3px'}}>{edu.position}</td>
                        <td style={{textAlign:'center',border:'1px solid #676767',padding:'3px'}}>{edu.salary}</td>
                        <td style={{textAlign:'center',border:'1px solid #676767',padding:'3px'}}>{edu.reason_for_leaving}</td>
                    </tr>
                    ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{textAlign:'center',border:'1px solid #676767'}}>ไม่มีข้อมูลการศึกษา</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div style={{margin:'2rem 0'}}>
                <p><strong>สมุดบัญชีธนาคาร</strong></p>
                {data.bank && data.bank.has_account ? (
                    <div style={{ display: 'grid',  gridTemplateColumns: 'repeat(4, 1fr)', 
                    columnGap: '20px', rowGap: '10px' }}>
                    <p>มี {data.bank.bank_name} สาขา {data.bank.bank_branch_office}</p>
                    <p>เลขบัญชี {data.bank.account_number}</p>
                    </div>
                ) : (
                    <p>ไม่มีธนาคาร</p>
                )}
            </div>

            <div style={{margin:'2rem 0'}}>
            <p><strong>เมื่อเกิดเหตุฉุกเฉิน บุคคลที่สามารถติดต่อได้</strong></p>
                {data.emergency_contact &&(
                    <>
                        <p>ชื่อ {data.emergency_contact.emergency_name}</p>
                        <div style={{ display: 'grid',  gridTemplateColumns: 'repeat(4, 1fr)', 
                        columnGap: '20px', rowGap: '1px' }}>   
                        <p>หมายเลขโทรศัพท์ {data.emergency_contact.emergency_phone_number}</p>
                        <p>หมายเลขโทรศัพท์ผู้ปกครอง: {data.emergency_contact.emergency_parent_phone || "ไม่มีข้อมูล"}</p>
                        <p>หมายเลขโทรศัพท์พี่น้อง: {data.emergency_contact.emergency_sibling_phone || "ไม่มีข้อมูล"}</p>
                        <p>หมายเลขโทรศัพท์ญาติ: {data.emergency_contact.emergency_relative_phone || "ไม่มีข้อมูล"}</p>
                        </div>
                    </>
                )}
            </div>

            <div style={{margin:'2rem 0'}}>
            <p><strong>ความสามารถพิเศษ</strong></p>
                {data.special_skills &&(
                    <div>
                    <p>ใบอนุญาตขับขี่: {data.special_skills.driving_license ? <strong>มี</strong> : <strong>ไม่มี</strong>}</p>
                    {data.special_skills.driving_license && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: '20px', rowGap: '10px' }}>
                          <p>เลขที่ใบอนุญาตขับขี่: {data.special_skills.driving_license.license_number}</p>
                          <p>หมดอายุ: {formatDate(data.special_skills.driving_license.expiry_date)}</p>
                          <p>ประเภทใบอนุญาต: {data.special_skills.driving_license.license_type}</p>
                        </div>
                        <div>
                          <p>สามารถขับรถจักรยานยนต์: {data.special_skills.driving_license.motorcycle ? <strong>ได้</strong> : <strong>ไม่ได้</strong>}</p>
                          <p>สามารถขับรถยนต์: {data.special_skills.driving_license.car ? <strong>ได้</strong> : <strong>ไม่ได้</strong>}</p>
                        </div>
                      </>
                    )}
                    <p>พร้อมที่จะเดินทางไปปฏิบัติงาน: {data.special_skills.willing_to_travel ? <strong>ใช่</strong> : <strong>ไม่</strong>}</p>
                    {data.special_skills.willing_to_travel && (
                      <p>เหตุผลที่พร้อมที่จะเดินทาง: {data.special_skills.reason_for_travel}</p>
                    )}
                  </div>
                )}
            </div>

            <div style={{margin:'1rem 0'}}>
            <p><strong>เอกสารเพิ่มเติม</strong></p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {data.file && data.file.length > 0 ? (
                    data.file.map((file) => (
                        
                        <button 
                            key={file._id} 
                            style={{
                                backgroundColor: '#EF4923',
                                color: '#fff',
                                boxShadow: '0 2px #bfbfbf',
                                border: 'none',
                                height: '2.5rem',
                                width: '10rem',
                                borderRadius: '0.5rem',
                                fontSize: '15px',
                                margin: '0.5rem 1rem',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleFileClick(`http://localhost:3200/${file.path}`)}
                        >
                            {file.filename}
                        </button>
                    ))
                ) : (
                    <p>ไม่มีเอกสารเพิ่มเติม</p>
                )}
            </div>

            
           
{/* 
            <div>
                <button style={{backgroundColor:'#EF4923',color:'#fff',
                boxShadow:'0 2px #bfbfbf',border:'none',height:'2.5rem',
                width:'10rem',borderRadius:'0.5rem',fontSize:'15px',
                margin:' 0.5rem 1rem ',cursor:'pointer'}} onClick={handleError}>สำเนาทะเบียนบ้าน</button>
            </div> */}
            
            <div style={{display:'flex',alignContent:'center',justifyContent:'center',margin:'2rem 0 0'}}>
                <button onClick={() => navigate(`/page-one/${id}`)}style={{
                backgroundColor:'#EF4923',color:'#fff',border:'none',boxShadow:'none',
                width:'4rem',height:'2rem',margin:'0.5rem',cursor:'pointer',}}>ย้อนกลับ</button>
                {/* <button onClick={() => navigate(`/page-two/${id}`)} style={{
                backgroundColor:'#EF4923',color:'#fff',border:'none',boxShadow:'none',
                width:'4rem',height:'2rem',margin:'0.5rem',cursor:'pointer',}}>ถัดไป</button> */}
            </div>
        </div>
    )
}
