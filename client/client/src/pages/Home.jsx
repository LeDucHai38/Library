export default function Home({ token, role }) {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🏠 Trang Chủ</h1>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>
                    Chào mừng đến với Thư viện
                </h2>

                {token ? (
                    <div>
                        <div style={{
                            background: '#dcfce7',
                            color: '#16a34a',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontWeight: '600'
                        }}>
                            ✅ Bạn đã đăng nhập thành công!
                        </div>
                        <div style={{ color: '#6b7280', marginBottom: '20px' }}>
                            Vai trò: <strong>{role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="/books" className="btn primary">📚 Xem sách</a>
                            {role !== 'admin' && <a href="/my-borrows" className="btn">📖 Sách đã mượn</a>}
                            {role === 'admin' && <a href="/borrows" className="btn">📋 Quản lý mượn</a>}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{
                            background: '#fef3c7',
                            color: '#d97706',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontWeight: '600'
                        }}>
                            ❌ Bạn chưa đăng nhập
                        </div>
                        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                            Vui lòng đăng nhập để sử dụng các tính năng của thư viện
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <a href="/auth/login" className="btn primary">🔑 Đăng nhập</a>
                            <a href="/auth/register" className="btn">📝 Đăng ký</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
