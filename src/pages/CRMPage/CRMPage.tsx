import React, { useState, useEffect, useCallback } from 'react';

// 内置种子数据
const seedCustomers = [
  { id: 1, username: '张伟', email: 'zhangwei@company.com', createdAt: '2025-06-15T09:30:00Z' },
  { id: 2, username: '李娜', email: 'lina@company.com', createdAt: '2025-06-20T14:15:00Z' },
  { id: 3, username: '王强', email: 'wangqiang@company.com', createdAt: '2025-07-01T10:00:00Z' },
  { id: 4, username: '刘洋', email: 'liuyang@company.com', createdAt: '2025-07-03T16:45:00Z' },
  { id: 5, username: '陈静', email: 'chenjing@company.com', createdAt: '2025-07-08T11:20:00Z' },
  { id: 6, username: '赵磊', email: 'zhaolei@company.com', createdAt: '2025-07-10T08:50:00Z' },
  { id: 7, username: '孙芳', email: 'sunfang@company.com', createdAt: '2025-07-12T13:30:00Z' },
  { id: 8, username: '周明', email: 'zhouming@company.com', createdAt: '2025-07-15T15:10:00Z' },
];

const seedCart = [
  { productId: 1001, name: '企业版授权 License', price: 2999.00, quantity: 2 },
  { productId: 1002, name: '技术支持服务包', price: 599.00, quantity: 3 },
  { productId: 1003, name: '数据存储扩容 1TB', price: 899.00, quantity: 1 },
  { productId: 1004, name: 'API 调用包 (10万次)', price: 199.00, quantity: 5 },
];

const CRMPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState(seedCustomers);
  const [cart, setCart] = useState(seedCart);
  const [logs, setLogs] = useState<{ time: string; message: string; type: string }[]>([
    { time: new Date().toLocaleTimeString('zh-CN'), message: 'CRM 系统已启动', type: 'system' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [cartForm, setCartForm] = useState({ productId: '', productName: '', productPrice: '', productQty: '1' });

  const logCount = logs.length;
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addLog = useCallback((message: string, type: string = '') => {
    const time = new Date().toLocaleTimeString('zh-CN');
    setLogs(prev => [...prev, { time, message, type }]);
  }, []);

  const titles: Record<string, string> = {
    dashboard: '仪表盘',
    customers: '客户管理',
    orders: '订单管理',
    logs: '操作日志',
  };

  // ===== 客户操作 =====
  const handleAddCustomer = () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      addLog('请填写所有字段', 'error');
      return;
    }
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    setCustomers(prev => [...prev, { id: newId, username, email, createdAt: new Date().toISOString() }]);
    addLog(`客户添加成功：${username}`, 'success');
    setFormData({ username: '', email: '', password: '' });
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    addLog(`客户已删除，ID：${id}`, 'success');
  };

  // ===== 购物车操作 =====
  const handleAddToCart = () => {
    const productId = parseInt(cartForm.productId);
    const name = cartForm.productName.trim();
    const price = parseFloat(cartForm.productPrice);
    const quantity = parseInt(cartForm.productQty);

    if (!productId || !name || isNaN(price) || !quantity) {
      addLog('请填写完整的商品信息', 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId, name, price, quantity }];
    });

    addLog(`商品已添加：${name} ×${quantity}，当前总价：$${cartTotal.toFixed(2)}`, 'success');
    setCartForm({ productId: '', productName: '', productPrice: '', productQty: '1' });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    addLog('商品已移除', 'success');
  };

  const handleClearCart = () => {
    setCart([]);
    addLog('购物车已清空', 'success');
  };

  const recentCustomers = [...customers].slice(-5).reverse();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: '14px', color: '#1e293b', background: '#f1f5f9' }}>
      {/* 侧边栏 */}
      <aside style={{ width: '240px', background: '#1e293b', color: '#cbd5e1', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '22px', color: '#4f6df5' }}>◆</span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>CRM System</span>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { key: 'dashboard', icon: '📊', label: '仪表盘' },
            { key: 'customers', icon: '👥', label: '客户管理' },
            { key: 'orders', icon: '📦', label: '订单管理' },
            { key: 'logs', icon: '📋', label: '操作日志' },
          ].map(item => (
            <a
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px',
                borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                background: activeTab === item.key ? '#4f6df5' : 'transparent',
                color: activeTab === item.key ? '#fff' : '#94a3b8',
              }}
            >
              <span style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#4f6df5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>A</div>
            <div>
              <div style={{ fontSize: '14px', color: '#f8fafc', fontWeight: 600 }}>Admin</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>管理员</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容 */}
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* 顶栏 */}
        <header style={{ height: '64px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.3 }}>{titles[activeTab]}</h1>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>首页 / {titles[activeTab]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>● 服务运行中</span>
            <span style={{ fontSize: '20px', cursor: 'pointer' }}>
            🔔
              </span>
          </div>
        </header>

        {/* ===== 仪表盘 ===== */}
        {activeTab === 'dashboard' && (
          <div style={{ padding: '24px 32px', flex: 1 }}>
            {/* 统计卡片 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
              {[
                { icon: '👥', bg: '#dbeafe', value: String(customers.length), label: '客户总数', bug: false },
                { icon: '📦', bg: '#dcfce7', value: String(cart.length), label: '订单商品数', bug: false },
                // BUG-2: 红底红字，金额看不见
                { icon: '💰', bg: '#fee2e2', value: `$${cartTotal.toFixed(2)}`, label: '订单总额', bug: true },
                { icon: '📝', bg: '#ede9fe', value: String(logCount), label: '操作记录', bug: false },
              ].map((card, i) => (
                <div key={i} style={{
                  background: card.bug ? '#ef4444' : '#fff', borderRadius: '10px', padding: '20px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', background: card.bug ? '#fee2e2' : card.bg, flexShrink: 0 }}>{card.icon}</div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: card.bug ? '#ef4444' : '#1e293b', lineHeight: 1.2 }}>{card.value}</div>
                    <div style={{ fontSize: '13px', color: card.bug ? '#fca5a5' : '#64748b', marginTop: '2px' }}>{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 双列 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              {/* 最近客户 */}
              <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700 }}>最近注册客户</h2>
                  <button onClick={() => setActiveTab('customers')} style={{ padding: '5px 12px', fontSize: '13px', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>查看全部</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#f8fafc' }}>{['ID', '用户名', '邮箱', '注册时间'].map(h => <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {recentCustomers.map(c => (
                      <tr key={c.id}>
                        <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>{c.id}</td>
                        <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>{c.username}</td>
                        <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>{c.email}</td>
                        <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>{new Date(c.createdAt).toLocaleString('zh-CN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 订单概览 */}
              <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700 }}>订单商品概览</h2>
                  <button onClick={() => setActiveTab('orders')} style={{ padding: '5px 12px', fontSize: '13px', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>管理订单</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#f8fafc' }}>{['商品名称', '数量', '小计'].map(h => <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.productId}>
                        <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.name}</td>
                        <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>总计</span>
                  <span style={{ fontSize: '22px', fontWeight: 700, color: '#ef4444', minWidth: '100px', textAlign: 'right' }}>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}><h2 style={{ fontSize: '16px', fontWeight: 700 }}>快捷操作</h2></div>
              <div style={{ padding: '24px', display: 'flex', gap: '12px' }}>
                {/* BUG-3: 白底白字按钮，文字看不见 */}
                <button onClick={() => setActiveTab('customers')} style={{ padding: '8px 18px', fontSize: '14px', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', background: '#ffffff', color: '#ffffff' }}>添加客户</button>
                <button onClick={() => setActiveTab('orders')} style={{ padding: '8px 18px', fontSize: '14px', fontWeight: 600, border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', background: '#f1f5f9', color: '#64748b' }}>新建订单</button>
                <button onClick={() => setActiveTab('logs')} style={{ padding: '8px 18px', fontSize: '14px', fontWeight: 600, border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', background: '#f1f5f9', color: '#64748b' }}>查看日志</button>
              </div>
            </div>

            {/* BUG-4: 公告栏文字与背景同色，不可见 */}
            <div style={{ background: '#f59e0b', color: '#f59e0b', padding: '16px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
              <span>系统公告：本周五凌晨 2:00-4:00 系统维护，请提前保存工作内容。</span>
            </div>
          </div>
        )}

        {/* ===== 客户管理 ===== */}
        {activeTab === 'customers' && (
          <div style={{ padding: '24px 32px', flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>客户列表</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '5px 12px', fontSize: '13px', background: '#4f6df5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ 添加客户</button>
              </div>
              {showAddForm && (
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div><label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>用户名</label><input value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="请输入用户名" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', marginTop: '6px' }} /></div>
                  <div><label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>邮箱</label><input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="请输入邮箱" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', marginTop: '6px' }} /></div>
                  <div><label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>密码</label><input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="至少6位" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', marginTop: '6px' }} /></div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                    <button onClick={handleAddCustomer} style={{ padding: '8px 18px', fontSize: '14px', fontWeight: 600, background: '#4f6df5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>确认添加</button>
                    <button onClick={() => setShowAddForm(false)} style={{ padding: '8px 18px', fontSize: '14px', fontWeight: 600, background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>取消</button>
                  </div>
                </div>
              )}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8fafc' }}>{['ID', '用户名', '邮箱', '注册时间', '操作'].map(h => <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      {/* BUG-5: 客户列表字体 12px，比其他区域 14px 小 */}
                      <td style={{ padding: '12px 24px', fontSize: '12px', borderBottom: '1px solid #e2e8f0' }}>{c.id}</td>
                      <td style={{ padding: '12px 24px', fontSize: '12px', borderBottom: '1px solid #e2e8f0' }}>{c.username}</td>
                      <td style={{ padding: '12px 24px', fontSize: '12px', borderBottom: '1px solid #e2e8f0' }}>{c.email}</td>
                      <td style={{ padding: '12px 24px', fontSize: '12px', borderBottom: '1px solid #e2e8f0' }}>{new Date(c.createdAt).toLocaleString('zh-CN')}</td>
                      <td style={{ padding: '12px 24px', fontSize: '12px', borderBottom: '1px solid #e2e8f0' }}><button onClick={() => handleDeleteCustomer(c.id)} style={{ padding: '4px 10px', fontSize: '13px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer' }}>删除</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== 订单管理 ===== */}
        {activeTab === 'orders' && (
          <div style={{ padding: '24px 32px', flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}><h2 style={{ fontSize: '16px', fontWeight: 700 }}>购物车 / 订单</h2></div>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div><label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>商品 ID</label><input type="number" value={cartForm.productId} onChange={e => setCartForm({ ...cartForm, productId: e.target.value })} placeholder="商品编号" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', marginTop: '6px' }} /></div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>商品名称</label><input value={cartForm.productName} onChange={e => setCartForm({ ...cartForm, productName: e.target.value })} placeholder="商品名称" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', marginTop: '6px' }} /></div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>单价</label><input type="number" step="0.01" value={cartForm.productPrice} onChange={e => setCartForm({ ...cartForm, productPrice: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', marginTop: '6px' }} /></div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>数量</label><input type="number" min="1" value={cartForm.productQty} onChange={e => setCartForm({ ...cartForm, productQty: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', marginTop: '6px' }} /></div>
                <div style={{ gridColumn: '1 / -1' }}><button onClick={handleAddToCart} style={{ padding: '8px 18px', fontSize: '14px', fontWeight: 600, background: '#4f6df5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>加入购物车</button></div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8fafc' }}>{['商品ID', '名称', '单价', '数量', '小计', '操作'].map(h => <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '32px 0' }}>购物车为空</td></tr>
                  ) : cart.map(item => (
                    <tr key={item.productId}>
                      <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.productId}</td>
                      <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.name}</td>
                      <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>${item.price.toFixed(2)}</td>
                      <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>{item.quantity}</td>
                      <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>${(item.price * item.quantity).toFixed(2)}</td>
                      <td style={{ padding: '12px 24px', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}><button onClick={() => handleRemoveFromCart(item.productId)} style={{ padding: '4px 10px', fontSize: '13px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer' }}>移除</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>总计</span>
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#ef4444', minWidth: '100px', textAlign: 'right' }}>${cartTotal.toFixed(2)}</span>
                <button onClick={handleClearCart} style={{ padding: '5px 12px', fontSize: '13px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>清空购物车</button>
              </div>
            </div>
          </div>
        )}

        {/* ===== 操作日志 ===== */}
        {activeTab === 'logs' && (
          <div style={{ padding: '24px 32px', flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>操作日志</h2>
                <button onClick={() => setLogs([{ time: new Date().toLocaleTimeString('zh-CN'), message: '日志已清空', type: 'system' }])} style={{ padding: '5px 12px', fontSize: '13px', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>清空日志</button>
              </div>
              <div style={{ padding: '16px 24px', background: '#0f172a', color: '#cbd5e1', fontFamily: 'Menlo, Monaco, Courier New, monospace', fontSize: '13px', maxHeight: '400px', overflowY: 'auto', lineHeight: 1.8 }}>
                {logs.map((entry, i) => (
                  <p key={i} style={{ marginBottom: '2px', color: entry.type === 'error' ? '#f87171' : entry.type === 'success' ? '#4ade80' : '#cbd5e1' }}>
                    [{entry.time}] {entry.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CRMPage;
