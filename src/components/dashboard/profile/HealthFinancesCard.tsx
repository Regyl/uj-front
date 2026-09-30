import {PersonalProfile} from "../../../types";
import {Box, Divider, Grid, Typography} from "@mui/material";
import {MetricCard} from "../../widgets/MetricCard";

interface ProfileOverviewProps {
    profile: PersonalProfile;
}

export const HealthFinancesCard = ({ profile }: ProfileOverviewProps) => (
    <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="subtitle2" gutterBottom sx={{
            color: "text.secondary"
        }}>
            Здоровье & финансы
        </Typography>
        <Grid container spacing={2}>
            {profile.health.map((metric) => (
                <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 12 }}>
                    <MetricCard
                        label={`${metric.label}`}
                        value={`${metric.currentValue} ${metric.unit}`}
                        helper={`тренд: ${metric.trend}`}
                        progress={Math.min(100, metric.currentValue)}
                    />
                </Grid>
            ))}
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, minWidth: 0 }}>
            {profile.finances.map((metric) => (
                <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={`${metric.value.toLocaleString('ru-RU')} ${metric.currency}`}
                    helper={`${metric.changePct > 0 ? '+' : ''}${metric.changePct}%`}
                    progress={Math.min(100, 75 + Math.abs(metric.changePct) * 2)}
                    accent="success"
                />
            ))}
        </Box>
    </Grid>
);