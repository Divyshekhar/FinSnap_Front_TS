"use client"
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Groups2Icon from "@mui/icons-material/Groups2";
import PropTypes from 'prop-types';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import Link from 'next/link';
const pages = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Expenses", path: "/expenses" },
    { name: "Incomes", path: "/incomes" },

];

function NavBar() {
    const router = useRouter();
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
    const [show, setShow] = useState('true');
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const checkAuth = () => {
            setToken(localStorage.getItem("authToken"));
        };

        window.addEventListener("storage", checkAuth);
        checkAuth();
        return () => window.removeEventListener("storage", checkAuth);
    }, []);
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);  // Set to null to close the menu
    };
    const handleSignOut = () => {
        localStorage.removeItem("authToken");
        setToken(null);
        window.dispatchEvent(new Event("storage"));
        router.push("/");
    };

    return (
        <AppBar position="fixed" sx={{
            // height: "60px",
            // backgroundColor: darkTheme?'rgb(156,39,176)':'rgba(25,118,210,1)',
            transition: 'backgroundColor 0.3s ease-in-out ,  top 0.1s ease-out',
            top: '0px'
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Groups2Icon sx={{
                        display: { xs: 'none', md: 'flex' },
                        // color: darkTheme?"white":"black",
                        transition: 'color 0.3s ease-in-out',
                        mr: 1
                    }} />
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{

                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            cursor: "pointer",
                            //   color: darkTheme?"white":"black",
                            textDecoration: 'none',
                            fontSize: '35px',
                            transition: 'color 0.3s ease-in-out'
                        }}
                        onClick={() => { router.push('/') }}
                    >
                        FinSnap
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' }

                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                    <Typography display="flex" justifyContent={"center"}>
                                        <Link href={page.path} style={{ textDecoration: "none", color: "inherit" }}>
                                            {page.name}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Groups2Icon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        href="/"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: "white",
                            textDecoration: 'none',
                            fontSize: '20px'
                        }}
                    >
                        FinSnap
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={handleCloseNavMenu}
                                component={Link}
                                href={page.path}
                                sx={{
                                    color: 'white',
                                    display: 'block',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    lettterSpacing: '.2rem',
                                    '&:focus': { outline: 'none' },
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },

                                }}>
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        {token ? (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    mr: 2,
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                    letterSpacing: ".2rem",
                                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                                }}
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                href="/signin"
                                sx={{
                                    mr: 1,
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                    letterSpacing: ".2rem",
                                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                                }}
                            >
                                Sign In
                            </Button>
                        )}
                        {token ? (
                            <></>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                href='/signup'
                                sx={{
                                    mr: 1,
                                    // color: darkTheme?"white":"black",
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    justifyContent: 'flex-end',
                                    letterSpacing: '.2rem',
                                    '&:focus': { outline: 'none' },
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                }}
                            >
                                Sign up
                            </Button>
                        )}


                        <Tooltip title="Toogle Theme">
                            <IconButton onClick={() => {
                                // setDarkTheme(prevState => !prevState);
                            }}
                                sx={{
                                    p: 0,
                                    color: 'inherit',
                                    '&:focus': { outline: 'none' },
                                    justifyContent: 'flex-end',

                                }}>
                                <DarkModeTwoToneIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

NavBar.propTypes = {
    setDarkTheme: PropTypes.func.isRequired,
    darkTheme: PropTypes.bool.isRequired
};


export default NavBar