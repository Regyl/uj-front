import {Box, Chip, Grid, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../hooks/hooks";
import {useEffect} from "react";
import {fetchLogins} from "../../../services/coreApiClient";
import {selectProfile} from "../../../store/selectors/profileSelectors";
import {ProviderIcon} from "../../widgets/ProviderIcon";
import DefaultSkeleton from "../../DefaultSkeleton";
import DefaultErrorLoading from "../../DefaultErrorLoading";

export const AccountsCard = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state) => state.profile.loading);
    const error = useAppSelector((state) => state.profile.error);
    const profile = useAppSelector(selectProfile);

    var dateMinusMonth : Date = new Date();
    dateMinusMonth.setMonth(new Date().getMonth() - 1);

    useEffect(() => {
        dispatch(fetchLogins());
    }, [dispatch]);

    if (loading) return <DefaultSkeleton/>
    if (error) return <DefaultErrorLoading/>

    return (
        <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" gutterBottom sx={{
                color: "text.secondary"
            }}>
                Аккаунты
            </Typography>
            <Stack spacing={1.5}>
                {profile.accounts.map((account) => (
                    <Stack
                        key={account.id}
                        direction={{ xs: 'column', sm: 'row' }}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 2,
                            p: 1.5,
                            gap: 1.5
                        }}>
                        <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{
                                alignItems: "center",
                                minWidth: 0,
                                flex: 1
                            }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1.5,
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >
                                <ProviderIcon domain={account.originUrl} sx={{ fontSize: 24 }} />
                            </Box>
                            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
                                    {account.originUrl}
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: "text.secondary"
                                }}>
                                    {account.usernameValue}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Chip
                            label={account.timesUsed}
                            color={account.timesUsed === null ? 'default' : account.timesUsed > 10 ? 'success' : 'warning'}
                            variant="outlined"
                            size="small"
                            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                        />
                        <Chip
                            label={account.lastUsed.substring(0, 10)}
                            color={account.lastUsed === null ? 'default' : new Date(account.lastUsed) > dateMinusMonth ? 'success' : 'warning'}
                            variant="outlined"
                            size="small"
                            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                        />
                    </Stack>
                ))}
            </Stack>
        </Grid>
    );
};