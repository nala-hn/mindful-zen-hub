import React, { useState } from 'react';
import { Button, Label, TextInput, Card } from 'flowbite-react';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user } = response.data.data;
            setAuth(user, access_token);
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
        } catch (error) {
            alert("Login Gagal! Periksa email dan password-mu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="flex flex-col w-full max-w-md gap-4">

                <Card>
                    <div className="text-center mb-2">
                        <h2 className="text-3xl font-extrabold text-gray-900">Mindful Zen Hub</h2>
                        <p className="text-sm text-gray-500">Masuk untuk mencatat ketenanganmu</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                        <div>
                            <Label htmlFor="email"/>
                            <TextInput
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password"/>
                            <TextInput
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" color="purple" disabled={loading}>
                            {loading ? 'Memproses...' : 'Masuk Sekarang'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;