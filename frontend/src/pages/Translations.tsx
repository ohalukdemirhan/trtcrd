import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../contexts/TranslationContext';
import {
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    Chip,
    FormControlLabel,
    Switch,
    Alert,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material';
import { createTranslation, fetchTranslations, clearCurrentTranslation } from '../store/slices/translationSlice';
import { RootState } from '../store';
import { AppDispatch } from '../store';
import { Translation, TranslationResponse } from '../types';
import { AutoFixHigh, DownloadOutlined } from '@mui/icons-material';

const Translations: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error, translations, currentTranslation } = useSelector((state: RootState) => state.translation);
    const { complianceResults } = useTranslation();

    const [formData, setFormData] = useState({
        sourceText: '',
        sourceLang: 'en',
        targetLang: 'tr',
        checkCompliance: true,
        complianceTemplate: 'gdpr',
    });

    useEffect(() => {
        dispatch(fetchTranslations({}));
        return () => {
            dispatch(clearCurrentTranslation());
        };
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
        const result = await dispatch(
            createTranslation({
                sourceText: formData.sourceText,
                sourceLang: formData.sourceLang,
                targetLang: formData.targetLang,
                context: formData.checkCompliance 
                    ? { compliance_check: true, template_id: formData.complianceTemplate === 'gdpr' ? 1 : 2 } 
                    : undefined,
            })
        );
        console.log('Translation result:', result);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleExportReport = () => {
        // Implementation of handleExportReport function
    };

    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Translations
            </Typography>

            <Grid container spacing={4}>
                {/* Translation Form */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            New Translation
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        name="sourceText"
                                        label="Text to Translate"
                                        value={formData.sourceText}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Source Language</InputLabel>
                                        <Select
                                            name="sourceLang"
                                            value={formData.sourceLang}
                                            label="Source Language"
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    sourceLang: e.target.value as string,
                                                }))
                                            }
                                            disabled={isLoading}
                                        >
                                            <MenuItem value="en">English</MenuItem>
                                            <MenuItem value="tr">Turkish</MenuItem>
                                            <MenuItem value="fr">French</MenuItem>
                                            <MenuItem value="de">German</MenuItem>
                                            <MenuItem value="es">Spanish</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Target Language</InputLabel>
                                        <Select
                                            name="targetLang"
                                            value={formData.targetLang}
                                            label="Target Language"
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    targetLang: e.target.value as string,
                                                }))
                                            }
                                            disabled={isLoading}
                                        >
                                            <MenuItem value="tr">Turkish</MenuItem>
                                            <MenuItem value="en">English</MenuItem>
                                            <MenuItem value="fr">French</MenuItem>
                                            <MenuItem value="de">German</MenuItem>
                                            <MenuItem value="es">Spanish</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ mt: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.checkCompliance}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            checkCompliance: e.target.checked,
                                                        }))
                                                    }
                                                    name="checkCompliance"
                                                />
                                            }
                                            label="Check Compliance"
                                        />
                                    </Box>
                                </Grid>

                                {formData.checkCompliance && (
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Compliance Template</InputLabel>
                                            <Select
                                                name="complianceTemplate"
                                                value={formData.complianceTemplate}
                                                label="Compliance Template"
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        complianceTemplate: e.target.value as string,
                                                    }))
                                                }
                                                disabled={isLoading}
                                            >
                                                <MenuItem value="gdpr">GDPR</MenuItem>
                                                <MenuItem value="kvkk">KVKK</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}

                                {error && (
                                    <Grid item xs={12}>
                                        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={isLoading || !formData.sourceText}
                                        sx={{ mt: 2 }}
                                    >
                                        {isLoading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            'Translate'
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>

                {/* Translation Result */}
                <Grid item xs={12} md={6}>
                    {currentTranslation ? (
                        <Paper sx={{ p: 4, height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                Translation Result
                            </Typography>
                            {currentTranslation?.translation && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Original Text ({currentTranslation.translation.source_language}):
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2, mb: 3, backgroundColor: 'background.default' }}>
                                        <Typography variant="body1">
                                            {currentTranslation.translation.source_text}
                                        </Typography>
                                    </Paper>
                                    
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Translated Text ({currentTranslation.translation.target_language}):
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.default' }}>
                                        <Typography variant="body1">
                                            {currentTranslation.translation.translated_text}
                                        </Typography>
                                    </Paper>
                                </Box>
                            )}

                            {!currentTranslation?.translation && (
                                <Box sx={{ mb: 3, textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No translation available. Please enter text and click translate.
                                    </Typography>
                                </Box>
                            )}

                            {currentTranslation.compliance_check && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                        Compliance Check
                                    </Typography>
                                    <Box sx={{ mb: 3 }}>
                                        <Chip 
                                            label={currentTranslation.compliance_check.is_compliant ? "Compliant" : "Non-Compliant"} 
                                            color={currentTranslation.compliance_check.is_compliant ? "success" : "error"}
                                            sx={{ mb: 2 }}
                                        />
                                    </Box>
                                    
                                    {!currentTranslation.compliance_check.is_compliant && (
                                        <>
                                            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
                                                Suggestions:
                                            </Typography>
                                            <List sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                                                {currentTranslation.compliance_check.suggestions.map((suggestion, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemText primary={suggestion} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </>
                                    )}
                                </>
                            )}

                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Compliance Results</Typography>
                                <IconButton size="small" onClick={handleExportReport}>
                                    <DownloadOutlined />
                                </IconButton>
                            </Box>

                            {complianceResults.map((result, index) => (
                                <Alert
                                    key={index}
                                    severity={(result.status === 'compliant' ? 'success' :
                                              result.status === 'warning' ? 'warning' :
                                              'error') as 'error' | 'warning' | 'info' | 'success'}
                                    sx={{ mb: 2 }}
                                    action={
                                        false && (
                                            <IconButton size="small">
                                                <AutoFixHigh />
                                            </IconButton>
                                        )
                                    }
                                >
                                    <Typography variant="subtitle2">{result.message}</Typography>
                                    {result.details && (
                                        <Typography variant="body2" color="textSecondary">
                                            {result.details}
                                        </Typography>
                                    )}
                                </Alert>
                            ))}
                        </Paper>
                    ) : (
                        <Paper sx={{ p: 4, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                Submit a translation to see the result here
                            </Typography>
                        </Paper>
                    )}
                </Grid>

                {/* Translation History */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Translation History
                        </Typography>
                        {translations.length > 0 ? (
                            <Grid container spacing={3}>
                                {translations.map((translation) => (
                                    <Grid item xs={12} key={translation.id}>
                                        <Card variant="outlined" sx={{ '&:hover': { boxShadow: 1 } }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Original ({translation.source_language}):
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {translation.source_text.length > 100
                                                                ? `${translation.source_text.substring(0, 100)}...`
                                                                : translation.source_text}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Translation ({translation.target_language}):
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {translation.translated_text.length > 100
                                                                ? `${translation.translated_text.substring(0, 100)}...`
                                                                : translation.translated_text}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(translation.created_at).toLocaleString()}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                    No translation history yet
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Translations; 