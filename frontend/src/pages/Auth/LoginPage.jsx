import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContent'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import toast from 'react-hot-toast'
import { AudioWaveform, Mail, Lock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function LoginPage() {

  // 邮箱
  const [email, setEmail] = useState('');
  // 密码
  const [password, setPassword] = useState('');
  // 错误信息
  const [error, setError] = useState('');
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 焦点字段, 用于显示错误信息
  const [focuseField, setFocuseField] = useState('');

  // 用于页面跳转
  const navigate = useNavigate();

  // 获取 login 方法
  const { login } = useAuth();

  // 处理登录提交
  const handleSubmit = async (e) => {
    // 阻止默认行为
    e.preventDefault();
    // 清空错误信息
    setError('');
    // 设置加载状态
    setLoading(true);
    try {
      // 调用 authService 的 login 方法
      const { token, user } = await authService.login(email, password);
      // 调用 login 方法
      login(user, token);
      // 显示成功信息
      toast.success('Login successful');
      // 跳转至 dashboard 页面
      navigate('/dashboard');
    } catch (error) {
      // 设置错误信息
      setError(error.message || 'Failed to login. Please check your credentials.');
      toast.error(error.message || 'Failed to login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50'>
      <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30' />
        <div className='relative w-full max-w-md px-6'>
          <div className='bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-10'>
            {/* Header */}
            <div className='text-center mb-10'>
              <div className='inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-6'>
                {/* 音频波形图标 */}
                <AudioWaveform className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              {/* 欢迎回来 */}
              <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'>Welcome back</h1>
              {/* 继续你的旅程 */}
              <p className='text-slate-500 text-sm'>Sign in to continue your journey</p>
            </div>
            {/* Form */}
            <div className='space-y-5'>
              {/* Email Input */}
              <div className='space-y-2'>
                <label htmlFor="email" className='block text-xs text-slate-700 font-medium uppercase tracking-wide'>Email</label>
                <div className='relative group'>
                  {/* 如果焦点字段为 email，则显示绿色，否则显示灰色 */}
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focuseField === 'email' ? 'text-emerald-500' : 'text-slate-400'
                  }`}>
                    <Mail className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // 设置焦点字段为 email
                    onFocus={() => setFocuseField('email')}
                    // 失去焦点时，清空焦点字段
                    onBlur={() => setFocuseField(null)}
                    className='w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 
                    text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 
                    focus:outline-none focus:border-emerald-500 focus: bg-white focus: shadow-lg focus:shadow-emerald-500/10'
                    placeholder='Enter your email'
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className='space-y-2'>
                <label htmlFor="password" className='block text-xs font-semibold text-slate-700 uppercase tracking-wide'>Password</label>
                <div className='relative group'>
                  {/* 如果焦点字段为 password，则显示绿色，否则显示灰色 */}
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focuseField === 'password' ? 'text-emerald-500' : 'text-slate-400'
                  }`}>
                    <Lock className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // 设置焦点字段为 password
                    onFocus={() => setFocuseField('password')}
                    // 失去焦点时，清空焦点字段
                    onBlur={() => setFocuseField(null)}
                    className='w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 
                    text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 
                    focus:outline-none focus:border-emerald-500 focus: bg-white focus: shadow-lg focus:shadow-emerald-500/10'
                    placeholder='Enter your password'
                  />
                </div>
              </div>

              {/* Error Message */}
              {/* 如果错误信息不为空，则显示错误信息 */}
              {error && (
                <div className='rounded-lg bg-red-50 border border-red-200 p-3'>
                  <p className='text-xs text-red-600 font-medium text-center'>{error}</p>
                </div>
              )}

              {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  // 如果正在加载，则禁用按钮
                  disabled={loading}
                  className='group relative w-full h-12 bg-linear-to-r from-emerald-500 
                  to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] 
                  text-white text-sm font-semibold rounded-xl transition-all duration-200
                  focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:active:scale-100 shadow-lg shadow-emerald-500/25 overflow-hidden cursor-pointer'
                >
                  <span className='relative z-10 flex items-center justify-center gap-2'>
                    {loading ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white/30 rounded-full animate-spin'>
                          Signing in...
                        </div>
                      </>
                    ) : (
                      <>
                          Sign in
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2.5} />
                      </>
                    )}
                  </span>
                  <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                  -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
                </button>
            </div>
            {/* Footer */}
            {/* 没有账号？ */}
            <div className='mt-8 pt-6 border-t border-slate-200/60'>
              <p className='text-center text-sm text-slate-600'>
                Don't have an account? {''} <Link to='/register' className='font-semibold text-emerald-500 hover:text-emerald-700 transition-colors duration-200'>Sign up</Link>
              </p>
            </div>
          </div>

          {/* Subtle footer text (不重要的文字) */}
          <p className='text-center text-xs text-slate-400 mt-6'>
            By contiuning, you agree to our Terms & Privacy Policy
          </p>
        </div>
    </div>
  )
}

export default LoginPage