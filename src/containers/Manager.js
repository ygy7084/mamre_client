import React from 'react';

class Manager extends React.Component {
    render() {
        return (
            <div className="table_div2">
                <h1>회원 데이터 조회</h1>
                <table>
                    <thead>
                    <th>번호</th>
                    <th>누적포인트</th>
                    </thead>
                    <tbody>
                    <tr>
                        <td>7084</td>
                        <td><input type='text' value='5'/></td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <a href='#'>수정</a>
                            <a href='#'>삭제</a>
                        </td>
                    </tr>
                    <tr>
                        <td>7084</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>7084</td>
                        <td>5</td>
                    </tr>

                    </tbody>
                </table>
            </div>
        )
    }
}

export default Manager;